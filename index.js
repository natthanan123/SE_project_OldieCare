const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const getRoutes = require('./routes/Get');
const putRoutes = require('./routes/Put');
app.use(getRoutes);
app.use(putRoutes);


// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('เชื่อมต่อ MongoDB สำเร็จ!'))
  .catch(err => console.log('เชื่อมต่อผิดพลาด:', err));

app.get('/', (req, res) => {
  res.send('OldieCare Backend รันอยู่จริง');
});

// ปรับ Schema ให้มีฟิลด์เหมือนในรูปเป๊ะๆ
/*const activitySchema = new mongoose.Schema({
    elderly: { type: mongoose.Schema.Types.ObjectId, ref: 'Elderly' }, // เก็บ ID ของผู้สูงอายุ
    topic: String,         // เช่น "นอน"
    description: String,   // เช่น "นอนบ้าน"
    startTime: String,     // "12:00"
    endTime: String,       // "13:40"
    date: Date,            // 2026-02-10
    status: String,        // "Upcoming"
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Activity = mongoose.model('Activity', activitySchema, 'activities');*/
  
  const Activity = require('./models/Activity');

  app.get('/api/activities', async (req, res) => {
    try {
      // ไปหาข้อมูลทั้งหมดในคอลเลกชัน activities ผ่าน Model ที่เราสร้างไว้
      const allActivities = await Activity.find();
      
      // ส่งข้อมูลกลับไปให้คนเรียกในรูปแบบ JSON
      res.json(allActivities);
    } catch (err) {
      console.error("ดึงข้อมูลพลาด:", err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server starts at http://localhost:${PORT}`));