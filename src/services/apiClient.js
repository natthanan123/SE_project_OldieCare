// src/services/apiClient.js
import axios from 'axios';

const IP_ADDRESS = '10.64.23.83'; 
const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

// ดึงโปรไฟล์พยาบาลคนนี้
export const getNurseProfile = async (id) => {
    const response = await axios.get(`${BASE_URL}/users/nurses/${id}`);
    return response.data;
};

// ดึงรายชื่อผู้สูงอายุที่ถูกมอบหมายให้พยาบาลคนนี้ดูแล
export const getAssignedElderly = async (nurseId) => {
    const response = await axios.get(`${BASE_URL}/elderlies/assigned/${nurseId}`);
    return response.data;
};

export const getActivities = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/activities`);
        return response.data;
    } catch (error) {
        console.error("API Error (getActivities):", error);
        throw error;
    }
};

// เพิ่มฟังก์ชันนี้เพื่ออัปเดตสถานะไปยัง MongoDB
export const updateActivityStatus = async (activityId, status) => {
    try {
        // ส่ง PATCH หรือ PUT ไปที่ backend (อิงตามไฟล์ routes/Put.js ที่คุณมี)
        const response = await axios.put(`${BASE_URL}/activities/${activityId}`, {
            status: status
        });
        return response.data;
    } catch (error) {
        console.error("API Error (updateActivityStatus):", error);
        throw error;
    }
};