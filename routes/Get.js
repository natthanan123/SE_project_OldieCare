const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ✅ ต้องเพิ่มบรรทัดนี้
const Elderly = require('../models/elderlies'); // ✅ เปลี่ยนชื่อตัวแปรให้ตรงกัน

router.get('/api/elderlies/assigned/:nurseId', async (req, res) => {
    try {
        const { nurseId } = req.params;
        
        // ค้นหาโดยใช้ ID พยาบาล และดึงจากคอลเลกชัน elderlies โดยตรง
        const assignedList = await Elderly.find({
            // ✅ ตัด role: 'elderly' ออก เพราะในคอลเลกชัน elderlies ไม่มีฟิลด์นี้
            assignedNurse: new mongoose.Types.ObjectId(nurseId)
        });
        
        console.log("พบข้อมูลผู้สูงอายุ:", assignedList);
        res.json(assignedList);
    } catch (error) {
        console.error("Get Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;