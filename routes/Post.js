const express = require('express');
const router = express.Router();
const { upload } = require('../Utils/imageHandler');
const User = require('../Model/User');
const Nurse = require('../Model/Nurse');
const Relative = require('../Model/Relative');
const Elderly = require('../Model/Elderly');
const Activity = require('../Activity/Activity');
const Ingredient = require('../Ingredient/Ingredient');
const Medication = require('../MED/Medication');

const safeParse = (data, defaultValue) => {
  try {
    if (!data || data === "undefined") return defaultValue;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    return defaultValue;
  }
};

// ================= UPLOAD NURSE DOCUMENTS =================
router.post(
  '/api/upload/nurse-documents',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  (req, res) => {
    try {
      const data = {};

      if (req.files.profileImage) {
        data.profileImage = req.files.profileImage[0].path;
      }
      
      if (req.files.licenseImage) {
        data.licenseImage = req.files.licenseImage[0].path;
      }

      if (req.files.certificateImages) {
        data.certificateImages = req.files.certificateImages.map(f => f.path);
      }

      res.json({
        message: 'Upload nurse documents success',
        data
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// 1. สร้าง Nurse
router.post(
  '/api/users/nurse',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'certificateImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      /* const { name, email, phone, password, specialization, yearsOfExperience } = req.body; */
      const { name, email, phone, specialization, yearsOfExperience } = req.body;

      const education = safeParse(req.body.education, { degree: "", major: "", university: "", graduationYear: 0 });
      const skills = safeParse(req.body.skills, []);
      const license = safeParse(req.body.license, { number: "", expiryDate: new Date() });

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        /* password, */
        role: 'nurse',
        profileImage: req.files.profileImage?.[0]?.path 
      });

      const savedUser = await user.save();

      // สร้าง Nurse
      const nurse = new Nurse({
        userId: savedUser._id,
        education,
        specialization: specialization || "-",
        skills,
        license,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        licenseImage: req.files.licenseImage?.[0]?.path,
        certificateImages: req.files.certificateImages
          ? req.files.certificateImages.map(f => f.path)
          : []
      });

      const savedNurse = await nurse.save();

      const userObj = savedUser.toObject();

      res.status(201).json({
        message: 'Nurse created successfully',
        user: userObj,
        nurse: savedNurse
      });

    } catch (error) {
      console.error("Create Nurse Error:", error);
      res.status(500).json({
        message: 'Error creating nurse',
        error: error.message
      });
    }
  }
);

// 2. สร้าง Relative
router.post(
  '/api/users/relative',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      /* const {
        name,
        email,
        phone,
        password,
        elderlyId,
        relationship,
        relationshipDetail,
        emergencyContact
      } = req.body; */
      const {
        name,
        email,
        phone,
        elderlyId,
        relationship,
        relationshipDetail,
        emergencyContact
      } = req.body;

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        /* password, */
        role: 'relative',
        profileImage: req.files.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Relative
      const relative = new Relative({
        userId: savedUser._id,
        elderlyId,
        relationship: relationship || "child",
        relationshipDetail: relationshipDetail || "",
        emergencyContact: emergencyContact === 'true' || emergencyContact === true
      });

      const savedRelative = await relative.save();

      const userObj = savedUser.toObject();

      res.status(201).json({
        message: 'Relative created successfully',
        user: userObj,
        relative: savedRelative
      });

    } catch (error) {
      res.status(500).json({
        message: 'Error creating relative',
        error: error.message
      });
    }
  }
);

// 3. สร้าง Elderly
router.post(
  '/api/users/elderly',
  upload.fields([
    { name: 'profileImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        dateOfBirth,
        age,
        assignedNurse
      } = req.body;

      const address = safeParse(req.body.address, { street: "", district: "", province: "", postalCode: "" });
      const medicalConditions = safeParse(req.body.medicalConditions, []);
      const medications = safeParse(req.body.medications, []);
      const foodAllergies = safeParse(req.body.foodAllergies, []);
      const diseaseAllergies = safeParse(req.body.diseaseAllergies, []);

      // สร้าง User
      const user = new User({
        name,
        email,
        phone,
        /* password, */
        role: 'elderly',
        profileImage: req.files?.profileImage?.[0]?.path || null
      });

      const savedUser = await user.save();

      // สร้าง Elderly details
      const elderly = new Elderly({
        userId: savedUser._id,
        name: name,
        dateOfBirth: dateOfBirth || new Date(),
        age: Number(age) || 0,
        weight: Number(req.body.weight) || 0,
        height: Number(req.body.height) || 0,
        address,
        medicalConditions,
        medications,
        foodAllergies,
        diseaseAllergies,
        assignedNurse: assignedNurse || null
      });

      const savedElderly = await elderly.save();

      const userObj = savedUser.toObject();

      res.status(201).json({
        message: 'Elderly person created successfully',
        user: userObj,
        elderly: savedElderly
      });

    } catch (error) {
      res.status(500).json({
        message: 'Error creating elderly person',
        error: error.message
      });
    }
  }
);
//สร้างActivity
router.post('/api/activity', async (req, res) => {
    try {
        const { elderly, elderlyname, topic, description, startTime, endTime, date } = req.body;

        const elderlyId = elderly || elderlyname;
        if (!elderlyId || !topic || !startTime || !endTime) {
            return res.status(400).json({ message: "Elderly ID, Topic, StartTime, and EndTime are required" });
        }

        const newActivity = new Activity({
            elderly: elderlyId,
            topic,
            description,
            startTime,
            endTime,
            date: date ? new Date(date) : new Date(),
            status: 'Upcoming'
        });

        const savedActivity = await newActivity.save();

        res.status(201).json({
            message: "Activity created successfully",
            data: savedActivity
        });

    } catch (error) {
        console.error("Create Activity Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//สร้างIngredient

router.post('/api/ingredient', async (req, res) => {
    try {
        const { name, category, caloriesPerGram, unit, description } = req.body;

        if (!name || !category || !caloriesPerGram) {
            return res.status(400).json({ message: "Name, category, and caloriesPerGram are required" });
        }

        const validCategories = ['Protein', 'Carbohydrate', 'Fat', 'Vegetable', 'Fruit'];
        if (!validCategories.includes(category)) {
             return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
        }

        const newIngredient = new Ingredient({
            name,
            category,
            caloriesPerGram: Number(caloriesPerGram),
            unit: unit || 'g',
            description
        });

        const savedIngredient = await newIngredient.save();

        res.status(201).json({
            message: "Ingredient created successfully",
            data: savedIngredient
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Ingredient name already exists" });
        }
        console.error("Create Ingredient Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

//สร้าง Medication
router.post('/api/medication', async (req, res) => {
    try {
        //รับค่าจากหน้าบ้าน (Frontend)
        const { elderly, name, quantity, unit, time, date } = req.body;

        //้ช็คว่ามี ID ผู้สูงอายุไหม
        if (!elderly) {
            return res.status(400).json({ message: "Elderly ID is required" });
        }

        //เช็คข้อมูลยาครบไหม
        if (!name || !quantity || !unit || !time) {
            return res.status(400).json({ message: "Name, Quantity, Unit, and Time are required" });
        }

        const newMedication = new Medication({
            elderly,
            name,
            quantity: Number(quantity),
            unit,
            time,
            date: date ? new Date(date) : new Date(), // ถ้าไม่ส่งวันที่มา ใช้วันปัจจุบัน
            status: 'Upcoming'
        });

        const savedMedication = await newMedication.save();

        res.status(201).json({
            message: "Medication schedule created successfully",
            data: savedMedication
        });

    } catch (error) {
        console.error("Create Medication Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
