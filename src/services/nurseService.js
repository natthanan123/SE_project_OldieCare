// src/services/nurseService.js
import { USE_MOCK } from '../utils/config';
// ✅ นำเข้าฟังก์ชันจาก apiClient ให้ครบทุกตัว
import { 
    getActivities, 
    deleteActivity, 
    getAssignedElderly, 
    createActivity, 
    getMedications, 
    updateMedStatus as apiUpdateMedStatus, 
    deleteMedication,
    createMedication // อย่าลืมเพิ่มฟังก์ชัน POST ยาใน apiClient ด้วยนะครับ
} from './apiClient'; 

// 1. ฟังก์ชันดึงรายชื่อผู้สูงอายุที่ได้รับมอบหมาย
export async function getAssignedElders() {
    if (USE_MOCK) {
        return [
            { id: '1', name: 'Margaret Thompson', age: 100, conditions: ['Diabetes'] },
            { id: '2', name: 'Robert Williams', age: 78, conditions: ['Arthritis'] },
        ];
    }
    try {
        const NURSE_ID = "6989acf7f8bd7b80f2ac0a56"; // ID พยาบาลที่ใช้ทดสอบ
        const data = await getAssignedElderly(NURSE_ID);
        return data; 
    } catch (error) {
        console.error("Service Error (getAssignedElders):", error);
        throw error;
    }
}

// 2. ฟังก์ชันดึงงานตาม ID ผู้สูงอายุ
export async function getTasksByElderId(elderId) {
    try {
        // 1. ดึงทั้งงานและรายชื่อผู้สูงอายุที่พยาบาลคนนี้ดูแลพร้อมกัน
        // ✏️ ตรวจสอบให้มั่นใจว่า NURSE_ID ตรงกับที่มีใน MongoDB ของคุณ
        const NURSE_ID = "6989acf7f8bd7b80f2ac0a56"; 

        const [allActivities, allElders] = await Promise.all([
            getActivities(),
            getAssignedElderly(NURSE_ID)
        ]);

        // 2. กรองงานตามความต้องการ (รายคน หรือ ทั้งหมด)
        const filtered = elderId 
            ? allActivities.filter(item => item.elderly === elderId) 
            : allActivities;

        // 3. ✅ Mapping ชื่อ: หัวใจสำคัญคือการหา Elder ที่มี ID ตรงกับใน Task
        return filtered.map(task => {
            // ค้นหาผู้สูงอายุโดยเทียบ ID (ตรวจสอบทั้ง ._id และ .id)
            const elder = allElders.find(e => (e._id === task.elderly || e.id === task.elderly));
            
            return {
                id: task._id,
                title: task.topic || 'No Title',
                time: task.startTime || '--:--',
                endTime: task.endTime,
                completed: task.status === 'Completed',
                // ✅ ถ้าหา elder เจอให้ใช้ชื่อจริง ถ้าไม่เจอถึงจะขึ้นว่า 'ทั่วไป'
                elderName: elder ? elder.name : 'ทั่วไป', 
                elderlyId: task.elderly
            };
        });
    } catch (error) {
        console.error("Service Error (getTasksByElderId):", error);
        throw error;
    }
}

// 3. ฟังก์ชันจัดการงาน (เพิ่ม/ลบ)
export async function addTask(taskData) {
    if (USE_MOCK) return { id: Date.now().toString(), ...taskData };
    try {
        return await createActivity(taskData);
    } catch (error) {
        console.error("Service Error (addTask):", error);
        throw error;
    }
}

export async function deleteTask(taskId) {
    if (USE_MOCK) return true;
    try {
        await deleteActivity(taskId); 
        return true;
    } catch (error) {
        console.error("Delete Error:", error);
        throw error;
    }
}

// 4. ฟังก์ชันดึงข้อมูลยาและการจัดการยา
export async function getMeds(elderId) {
    if (USE_MOCK) {
        return [{ id: 'm1', name: 'Lisinopril', dose: '10mg', time: '08:00 AM', status: 'Upcoming' }];
    }
    try {
        const allMeds = await getMedications();
        const filteredMeds = elderId ? allMeds.filter(m => m.elderly === elderId) : allMeds;

        // Mapping ข้อมูลให้เข้ากับ UI ของ MedsScreen
        return filteredMeds.map(item => ({
            id: item._id,
            name: item.name,
            dose: `${item.quantity || ''} ${item.unit || ''}`, // เช่น "2 Capsule"
            time: item.time || '--:--',
            status: item.status || 'Upcoming',
            elderlyId: item.elderly
        }));
    } catch (error) {
        console.error("Service Error (getMeds):", error);
        return [];
    }
}

// ✅ 5. ฟังก์ชันเพิ่มข้อมูลยาใหม่ (สำหรับหน้า AddMedScreen.js)
export async function addMedication(medData) {
    if (USE_MOCK) return { id: Date.now().toString(), ...medData };
    try {
        // ส่งข้อมูลไปที่ Backend เพื่อบันทึกลงคอลเลกชัน medications
        return await createMedication(medData);
    } catch (error) {
        console.error("Service Error (addMedication):", error);
        throw error;
    }
}

export async function updateMedStatus(medId, status) {
    if (USE_MOCK) return true;
    try {
        await apiUpdateMedStatus(medId, status);
        return true;
    } catch (error) {
        console.error("Update Med Error:", error);
        throw error;
    }
}

export async function deleteMed(medId) {
    if (USE_MOCK) return true;
    try {
        await deleteMedication(medId);
        return true;
    } catch (error) {
        console.error("Delete Med Error:", error);
        throw error;
    }
}