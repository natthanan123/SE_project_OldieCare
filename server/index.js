import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'test';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, serverSelectionTimeoutMS: 8000 });
console.log('[DB] connected to', DB_NAME);

// Use flexible schemas for existing collections
const Elderly  = mongoose.model('elderlies', new mongoose.Schema({}, { strict: false }), 'elderlies');
const Nurse    = mongoose.model('nurses',    new mongoose.Schema({}, { strict: false }), 'nurses');
const Relative = mongoose.model('relatives', new mongoose.Schema({}, { strict: false }), 'relatives');

// Chat collections
const Thread = mongoose.model('threads', new mongoose.Schema({
  patientId: String,
  participants: [{ userId: String, role: String, name: String }],
  lastMessage: { text: String, time: Date }
}, { timestamps: true }), 'threads');

const Message = mongoose.model('messages', new mongoose.Schema({
  threadId: String,
  senderId: String,
  senderRole: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
}), 'messages');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=> res.json({ ok: true }));

// Home summary (read-only)
app.get('/patients/:id/summary', async (req, res) => {
  const id = req.params.id;
  const elderly = await Elderly.findOne({ $or: [{ _id: id }, { elderlyId: id }, { id }] });
  return res.json({
    calories: elderly?.calories ?? 1200,
    temp: elderly?.temperature ?? 36.5,
    tdee: elderly?.tdee ?? 1400,
    pressure: elderly?.bp ?? elderly?.pressure ?? '120/80',
    calTargetMin: 1400,
    calTargetMax: 1600,
    updatedAt: elderly?.updatedAt ?? new Date(),
    meds: Array.isArray(elderly?.meds)
      ? elderly.meds.map((m) => ({
          id: m.id ?? String(Math.random()),
          name: m.name ?? '',
          time: m.time ?? '',
          status: m.status ?? (m.taken ? 'taken' : 'pending'),
        }))
      : [],
  });
});

// Reports/Notifications stubs (empty arrays until you add collections)
app.get('/patients/:id/reports', async (req,res)=> res.json([]));
app.get('/patients/:id/notifications', async (req,res)=> res.json([]));

// Threads for the relative; bootstrap nurse/admin threads if absent
app.get('/threads', async (req, res) => {
  const relativeId = req.query.relativeId || 'RELATIVE_DEMO';
  const rel = await Relative.findOne({ $or: [{ _id: relativeId }, { relativeId }, { id: relativeId }] });
  const patientId = rel?.patientId || rel?.elderlyId || 'DEMO_PATIENT';

  const nurse = await Nurse.findOne({ $or: [{ patients: patientId }, { elderlyId: patientId }] });
  const adminName = 'Company Admin';

  const ensure = async (role, name) => {
    let t = await Thread.findOne({ patientId, 'participants.role': role });
    if (!t) {
      t = await Thread.create({
        patientId,
        participants: [
          { userId: String(relativeId), role: 'relative', name: rel?.name || 'Relative' },
          { userId: role === 'nurse' ? String(nurse?._id || 'NURSE_DEMO') : 'ADMIN', role, name },
        ],
        lastMessage: { text: '', time: new Date(0) },
      });
    }
    return t;
  };

  const t1 = await ensure('nurse', nurse?.name || 'Nurse');
  const t2 = await ensure('admin', adminName);

  const toItem = (t) => ({
    id: String(t._id),
    name: t.participants.find((p) => p.role !== 'relative')?.name || 'Unknown',
    role: t.participants.find((p) => p.role !== 'relative')?.role || 'nurse',
    lastMsg: t.lastMessage?.text || '',
    time: t.lastMessage?.time ? new Date(t.lastMessage.time).toLocaleString() : '',
  });

  res.json({ threads: [toItem(t1), toItem(t2)] });
});

app.get('/threads/:id/messages', async (req, res) => {
  const msgs = await Message.find({ threadId: req.params.id }).sort({ createdAt: 1 });
  res.json({ messages: msgs.map((m) => ({ id: String(m._id), text: m.text, sender: m.senderRole === 'relative' ? 'me' : 'other', createdAt: m.createdAt })) });
});

app.post('/threads/:id/messages', async (req, res) => {
  const text = (req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'text required' });
  const msg = await Message.create({ threadId: req.params.id, text, senderId: 'RELATIVE_DEMO', senderRole: 'relative' });
  await Thread.findByIdAndUpdate(req.params.id, { lastMessage: { text, time: new Date() } });
  res.json({ message: { id: String(msg._id), text: msg.text, sender: 'me', createdAt: msg.createdAt } });
});

app.listen(PORT, () => console.log(`[API] http://localhost:${PORT} (db: ${DB_NAME})`));
