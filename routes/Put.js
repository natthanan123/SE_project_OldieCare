const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// ✅ นำเข้า Model ทั้งสองตัวเพื่อใช้งาน
const Elderly = require('../models/elderlies'); 
const Activity = require('../models/Activity'); 

// 1. API สำหรับ Admin มอบหมายพยาบาลให้ผู้สูงอายุ
router.put('/api/elderlies/assign-nurse', async (req, res) => {
    try {
        const { elderlyId, nurseId } = req.body; 

        const updatedElderly = await Elderly.findByIdAndUpdate(
            elderlyId,
            { assignedNurse: new mongoose.Types.ObjectId(nurseId) }, // ✅ ใช้ ObjectId ตามที่ตกลงกัน
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

// 2. API สำหรับพยาบาลอัปเดตสถานะกิจกรรม (เช่น Pending -> Completed)
router.put('/api/activities/:id', async (req, res) => {
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

module.exports = router;