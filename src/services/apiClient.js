import axios from 'axios';

// ✅ ประกาศ URL กลางที่ชี้ไปยัง Render
const API_URL = "https://se-project-oldiecare.onrender.com";

// --- ส่วนของ User & Nurse ---
// ดึงข้อมูลโปรไฟล์พยาบาล
export const getNurseProfile = async (id) => {
    // ใช้ path ตามที่ระบุใน Get.js ของเพื่อน
    const response = await axios.get(`${API_URL}/api/users/nurses/${id}`);
    return response.data;
};

// --- ส่วนของผู้สูงอายุ (My Patients) ---
// ดึงรายชื่อผู้สูงอายุที่พยาบาลคนนี้ได้รับมอบหมาย
export const getAssignedElderly = async (nurseId) => {
    try {
        // ✅ เรียกข้อมูลจาก route หลักที่เพื่อนมี populate assignedNurse ไว้ให้
        const response = await axios.get(`${API_URL}/api/users/elderly`); 
        const allElderly = response.data;

        // ✅ กรองข้อมูลเฉพาะที่ assignedNurse ID ตรงกับพยาบาลที่ Login อยู่
        return allElderly
            .filter(elder => {
                const assignedId = elder.assignedNurse?._id || elder.assignedNurse;
                return assignedId === nurseId;
            })
            .map(item => {
                // ✅ แปลงข้อมูลให้อยู่ในรูปแบบที่หน้าจอ Home และ Card ต้องการ
                const user = item.userId || {};
                return {
                    id: item._id,
                    name: user.name || item.name,
                    image: user.profileImage || null,
                    age: item.age,
                    conditions: item.medicalConditions || [],
                    allergies: item.diseaseAllergies || [],
                    room: item.room || "-"
                };
            });
    } catch (error) {
        console.error("API Error (getAssignedElderly):", error);
        throw error;
    }
};

// --- ส่วนของกิจกรรม (Activities) ---
// 1. ดึงกิจกรรมทั้งหมด
export const getActivities = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/activity`); 
        return response.data;
    } catch (error) {
        console.warn("Temporary: Activity route not found, returning empty array.");
        return [];
    }
};

// 2. อัปเดตสถานะกิจกรรม (เช่น เปลี่ยนเป็น Completed)
export const updateActivityStatus = async (activityId, status) => {
    try {
        const response = await axios.put(`${API_URL}/api/activity/${activityId}`, { status });
        return response.data;
    } catch (error) {
        console.error("API Error (updateActivityStatus):", error);
        throw error;
    }
};

// 3. สร้างกิจกรรมใหม่
export const createActivity = async (activityData) => {
    try {
        const response = await axios.post(`${API_URL}/api/activity`, activityData);
        return response.data;
    } catch (error) {
        console.error("API Error (createActivity):", error);
        throw error;
    }
};

// 4. ลบกิจกรรม
export const deleteActivity = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/activity/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteActivity):", error);
        throw error;
    }
};

// --- ส่วนของยา (Medications) ---
// 1. ดึงข้อมูลยาตาม ID ผู้สูงอายุ และวันที่
export const getMedications = async (elderlyId, date) => {
    try {
        // ใช้ path /api/medication (เอกพจน์) ตาม Get.js ของเพื่อน
        const response = await axios.get(`${API_URL}/api/medication`, {
            params: { elderlyId, date }
        });
        return response.data;
    } catch (error) {
        console.warn("Temporary: Medication route not found, returning empty array.");
        return [];
    }
};

// 2. บันทึกข้อมูลยาใหม่
export const createMedication = async (medData) => {
    try {
        const response = await axios.post(`${API_URL}/api/medication`, medData);
        return response.data;
    } catch (error) {
        console.error("API Error (createMedication):", error);
        throw error;
    }
};

// 3. อัปเดตสถานะการทานยา (เช่น Taken)
export const updateMedStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/api/medication/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error("API Error (updateMedStatus):", error);
        throw error;
    }
};

// 4. ลบข้อมูลยา
export const deleteMedication = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/medication/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteMedication):", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    // ส่งไปยัง Route ที่เพื่อนคุณเขียนไว้
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    return response.data;
  };