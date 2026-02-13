import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

/* ================= AUTH ================= */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function startServer() {
  try {
    await client.connect();
    const db = client.db('test');

    console.log('✅ MongoDB Connected');

    /* ================= LOGIN ================= */
    app.post('/auth/login-simple', async (req, res) => {
      const email = req.body.email?.trim();

      const user = await db.collection('users').findOne({
        email: { $regex: new RegExp("^" + email + "$", "i") }
      });

      if (!user)
        return res.status(404).json({ message: 'ไม่พบอีเมล' });

      const relative = await db.collection('relatives')
        .findOne({ userId: user._id });

      if (!relative)
        return res.status(404).json({ message: 'ยังไม่ได้ผูกผู้สูงอายุ' });

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        elderlyId: String(relative.elderlyId)
      });
    });

    /* ================= PATIENT SUMMARY ================= */
    app.get('/patients/:id/summary', auth, async (req, res) => {
      const _id = new ObjectId(req.params.id);

      const elder = await db.collection('elderlies')
        .findOne({ _id });

      if (!elder)
        return res.status(404).json({ message: 'Patient not found' });

      const bmi =
        elder.weight && elder.height
          ? (elder.weight / Math.pow(elder.height / 100, 2)).toFixed(1)
          : 'N/A';

      const meds = await db.collection('medications')
        .find({ elderly: _id })
        .toArray();

      res.json({
        profile: {
          name: elder.name,
          age: elder.age,
          bmi
        },
        calories: elder.calories || 0,
        temp: elder.temp || 0,
        meds
      });
    });

    /* ================= ACTIVITIES ================= */
    app.get('/activities', auth, async (req, res) => {
      const relative = await db.collection('relatives')
        .findOne({ userId: new ObjectId(req.user.userId) });

      if (!relative) return res.json([]);

      const activities = await db.collection('activities')
        .find({ elderly: new ObjectId(relative.elderlyId) })
        .toArray();

      res.json(activities);
    });

    /* ================= REPORTS ================= */
    app.get('/reports', auth, async (req, res) => {
      const data = await db.collection('reports')
        .find({ userId: new ObjectId(req.user.userId) })
        .sort({ time: -1 })
        .toArray();

      res.json(data);
    });

    /* ================= NOTIFICATIONS ================= */
    app.get('/notifications', auth, async (req, res) => {
      const data = await db.collection('notifications')
        .find({ userId: new ObjectId(req.user.userId) })
        .sort({ time: -1 })
        .toArray();

      res.json(data);
    });

    /* ================= THREADS ================= */
    app.get('/threads', auth, async (req, res) => {
      const threads = await db.collection('threads')
        .find({ participants: new ObjectId(req.user.userId) })
        .toArray();

      res.json(threads);
    });

    app.get('/threads/:id/messages', auth, async (req, res) => {
      const messages = await db.collection('messages')
        .find({ threadId: new ObjectId(req.params.id) })
        .sort({ createdAt: 1 })
        .toArray();

      res.json(messages);
    });

    app.post('/threads/:id/messages', auth, async (req, res) => {
      const msg = {
        threadId: new ObjectId(req.params.id),
        text: req.body.text,
        sender: req.user.userId,
        createdAt: new Date()
      };

      await db.collection('messages').insertOne(msg);
      res.json(msg);
    });

    app.listen(port, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${port}`)
    );

  } catch (err) {
    console.error(err);
  }
}


const elderly = await db.collection('elderlies')
  .findOne({ userId: new ObjectId(req.user.userId) });


startServer();
