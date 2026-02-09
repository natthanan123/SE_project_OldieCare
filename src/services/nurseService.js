// src/services/nurseService.js
import { USE_MOCK } from '../utils/config';

// ต้องประกาศไว้ด้านบนสุดเพื่อให้ทุกฟังก์ชันเรียกใช้ข้อมูลชุดเดียวกัน
let mockTasks = [
  { id: 't1', title: 'Morning Medication', time: '08:30 AM', completed: true, type: 'med' },
  { id: 't2', title: 'Vital Signs Check', time: '10:00 AM', completed: false, type: 'vital' },
];

// สำคัญ: ต้องมีคำว่า export และชื่อฟังก์ชันต้องสะกดให้ตรงกับที่ Hook เรียกใช้
export async function getAssignedElders() {
  if (USE_MOCK) {
    return [
      {
        id: '1',
        name: 'Margaret Thompson',
        age: 100,
        conditions: ['Diabetes', 'Hypertension'],
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=200&h=200&auto=format&fit=crop'
      },
      {
        id: '2',
        name: 'Robert Williams',
        age: 78,
        conditions: ['Arthritis'],
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=200&h=200&auto=format&fit=crop'
      },
    ];
  }
  // ในอนาคตเมื่อต่อ MongoDB จะใส่โค้ด axios ตรงนี้
}

export async function getTasksByElderId(elderId) {
  if (USE_MOCK) {
    return [...mockTasks];
  }
}

export async function addTask(newItem) {
  if (USE_MOCK) {
    const taskWithId = {
      ...newItem,
      id: `t${Date.now()}`,
      completed: false,
      //type: newItem.type || 'general'
    };
    mockTasks.push(taskWithId);
    return taskWithId;
  }
}

export async function deleteTask(taskId) {
  if (USE_MOCK) {
    // กรองเอาเฉพาะรายการที่ ID ไม่ตรงกับที่ส่งมา (คือการลบนั่นเอง)
    mockTasks = mockTasks.filter(t => t.id !== taskId);
    return true;
  }
}

let mockMeds = [
  { id: 'm1', elderId: '1', elderName: 'Margaret Thompson', name: 'Lisinopril', dose: '10mg tablet', time: '08:00 AM', status: 'Taken' },
  { id: 'm2', elderId: '1', elderName: 'Margaret Thompson', name: 'Atorvastatin', dose: '20mg tablet', time: '09:00 AM', status: 'Taken' },
  { id: 'm3', elderId: '1', elderName: 'Robert Williams', name: 'Omeprazole', dose: '20mg capsule', time: '09:30 AM', status: 'Missed' },
  { id: 'm4', elderId: '2', elderName: 'Mrs. Smith', name: 'Metformin', dose: '500mg tablet', time: '10:00 AM', status: 'Upcoming' },
]

export async function getMeds(elderId = null) {
  if (USE_MOCK) {
    // ถ้ามี elderId ให้กรองเฉพาะคนนั้น ถ้าไม่มีให้ส่งทั้งหมด (สำหรับ Tab Bar)
    return elderId ? mockMeds.filter(m => m.elderId === elderId) : [...mockMeds];
  }
}

export async function updateMedStatus(medId, status) {
  const med = mockMeds.find(m => m.id === medId);
  if (med) med.status = status;
  return med;
}

export async function deleteMed(medId) {
  mockMeds = mockMeds.filter(m => m.id !== medId);
  return true;
}

export async function addMed(newMed) {
  if (USE_MOCK) {
      const medWithId = {
          ...newMed,
          id: `m${Date.now()}`,
          status: 'Upcoming' // ค่าเริ่มต้นสำหรับยาที่เพิ่มใหม่
      };
      mockMeds.push(medWithId);
      return medWithId;
  }
}