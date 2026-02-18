// src/services/apiClient.js
import axios from 'axios';

const IP_ADDRESS = '10.64.22.109'; 
const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

// --- ส่วนของ User & Nurse ---
export const getNurseProfile = async (id) => {
    const response = await axios.get(`${BASE_URL}/users/nurses/${id}`);
    return response.data;
};

// --- ส่วนของผู้สูงอายุ ---
export const getAssignedElderly = async (nurseId) => {
    const response = await axios.get(`${BASE_URL}/elderlies/assigned/${nurseId}`);
    return response.data;
};

// --- ส่วนของกิจกรรม (Activities) ---
export const getActivities = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/activities`);
        return response.data;
    } catch (error) {
        console.error("API Error (getActivities):", error);
        throw error;
    }
};

export const updateActivityStatus = async (activityId, status) => {
    try {
        const response = await axios.put(`${BASE_URL}/activities/${activityId}`, { status });
        return response.data;
    } catch (error) {
        console.error("API Error (updateActivityStatus):", error);
        throw error;
    }
};

export const createActivity = async (activityData) => {
    try {
        const response = await axios.post(`${BASE_URL}/activities`, activityData);
        return response.data;
    } catch (error) {
        console.error("API Error (createActivity):", error);
        throw error;
    }
};

// ✅ เพิ่มฟังก์ชันลบกิจกรรม (เรียกใช้ใน nurseService.deleteTask)
export const deleteActivity = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/activities/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (deleteActivity):", error);
        throw error;
    }
};

// --- ส่วนของยา (Medications) ---
export const getMedications = async () => {
    const response = await axios.get(`${BASE_URL}/medications`);
    return response.data;
};

// ✅ เพิ่มฟังก์ชันบันทึกยาใหม่ (เรียกใช้ใน nurseService.addMedication)
export const createMedication = async (medData) => {
    try {
        const response = await axios.post(`${BASE_URL}/medications`, medData);
        return response.data;
    } catch (error) {
        console.error("API Error (createMedication):", error);
        throw error;
    }
};

export const updateMedStatus = async (id, status) => {
    const response = await axios.put(`${BASE_URL}/medications/${id}`, { status });
    return response.data;
};

export const deleteMedication = async (id) => {
    const response = await axios.delete(`${BASE_URL}/medications/${id}`);
    return response.data;
};