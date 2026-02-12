// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// นำเข้า Routes จากโฟลเดอร์ routes
const getRoutes = require('./routes/Get');
const putRoutes = require('./routes/Put');

// ✅ รวมท่อข้อมูลให้ผ่าน /api ทั้งหมด เพื่อให้ apiClient.js เรียกใช้งานได้ถูกที่
app.use('/api', getRoutes);
app.use('/api', putRoutes);

// เชื่อมต่อ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' เชื่อมต่อ MongoDB สำเร็จ!'))
  .catch(err => console.log(' เชื่อมต่อผิดพลาด:', err));

// หน้าแรกสำหรับเช็คสถานะเซิร์ฟเวอร์
app.get('/', (req, res) => {
  res.send('OldieCare Backend รันอยู่จริง');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server starts at http://localhost:${PORT}`));