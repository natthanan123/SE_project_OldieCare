// routes/Put.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// นำเข้า Model เพื่อติดต่อกับฐานข้อมูล
const Elderly = require('../models/elderlies'); 
const Activity = require('../models/Activity'); 
const Medication = require('../models/Medication'); //

// 1. [PUT] สำหรับ Admin มอบหมายพยาบาลให้ผู้สูงอายุ
// URL: PUT /api/elderlies/assign-nurse
router.put('/elderlies/assign-nurse', async (req, res) => {
    try {
        const { elderlyId, nurseId } = req.body; 

        const updatedElderly = await Elderly.findByIdAndUpdate(
            elderlyId,
            { assignedNurse: new mongoose.Types.ObjectId(nurseId) },
            { new: true }
        );

        if (!updatedElderly) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้สูงอายุ' });
        }
        res.json({ message: 'มอบหมายงานสำเร็จ', data: updatedElderly });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [PUT] สำหรับพยาบาลอัปเดตสถานะงาน (เช่น Pending -> Completed)
// URL: PUT /api/activities/:id
router.put('/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'รูปแบบ ID กิจกรรมไม่ถูกต้อง' });
        }

        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลกิจกรรม' });
        }
        res.json(updatedActivity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. [POST] สำหรับสร้างกิจกรรมใหม่ (Add Task)
// URL: POST /api/activities ✅ แก้ปัญหา Error 404 ที่นี่
router.post('/activities', async (req, res) => {
    try {
        // รับข้อมูลจากแอป (elderly, topic, startTime, etc.)
        const newActivity = new Activity(req.body);
        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. [PUT] สำหรับอัปเดตสถานะการกินยา (เช่น Upcoming -> Taken)
// URL: PUT /api/medications/:id
router.put('/medications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'รูปแบบ ID ยาไม่ถูกต้อง' });
        }

        const updatedMed = await Medication.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedMed) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลยา' });
        }
        res.json(updatedMed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. [POST] สำหรับเพิ่มข้อมูลยาใหม่
// URL: POST /api/medications
router.post('/medications', async (req, res) => {
    try {
        const newMed = new Medication(req.body);
        await newMed.save();
        res.status(201).json(newMed);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;