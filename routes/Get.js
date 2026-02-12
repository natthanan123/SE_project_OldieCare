// routes/Get.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Elderly = require('../models/elderlies'); 
const Activity = require('../models/Activity'); // ✅ เพิ่มเพื่อดึงข้อมูลกิจกรรมด้วย

// 1. API ดึงรายชื่อผู้สูงอายุที่ถูกมอบหมาย (เรียกใช้: GET /api/elderlies/assigned/:nurseId)
router.get('/elderlies/assigned/:nurseId', async (req, res) => {
    try {
        const { nurseId } = req.params;
        
        // ตรวจสอบความถูกต้องของ ID ก่อนค้นหา
        if (!mongoose.Types.ObjectId.isValid(nurseId)) {
            return res.status(400).json({ message: 'รูปแบบ ID พยาบาลไม่ถูกต้อง' });
        }

        // ✅ ตัด /api ออกจาก Path และค้นหาด้วย assignedNurse
        const assignedList = await Elderly.find({
            assignedNurse: new mongoose.Types.ObjectId(nurseId)
        });
        
        console.log("พบข้อมูลผู้สูงอายุสำหรับพยาบาล ID:", nurseId, assignedList.length, "คน");
        res.json(assignedList);
    } catch (error) {
        console.error("Get Elders Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. API ดึงกิจกรรมทั้งหมด (เรียกใช้: GET /api/activities)
router.get('/activities', async (req, res) => {
    try {
        // ✅ ดึงกิจกรรมทั้งหมดจาก MongoDB เพื่อนำมา Filter ต่อที่หน้าบ้าน
        const allActivities = await Activity.find();
        res.json(allActivities);
    } catch (err) {
        console.error("Get Activities Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม" });
    }
});

// 3. API ดึงข้อมูลยาทั้งหมด (เรียกใช้: GET /api/medications)
router.get('/medications', async (req, res) => {
    try {
        const Medication = require('../models/Medication'); // ตรวจสอบชื่อไฟล์ Model ของคุณ
        const allMeds = await Medication.find();
        res.json(allMeds);
    } catch (err) {
        console.error("Get Medications Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลยา" });
    }
});

module.exports = router;