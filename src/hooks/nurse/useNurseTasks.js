// src/hooks/nurse/useNurseTasks.js
import { useState, useCallback, useEffect } from 'react';
import { getTasksByElderId } from '../../services/nurseService';

export function useNurseTasks(elderId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      // ส่ง elderId ไปที่ service (ถ้าเป็น null จะเป็นการดึงงานทั้งหมด)
      const data = await getTasksByElderId(elderId || null); 

      // ✅ ปรับการ Mapping ให้รองรับ elderName จาก Service
      const formattedData = (data || []).map(item => ({
        // ใช้ข้อมูลที่ผ่านการจัดการเบื้องต้นจาก nurseService มาแล้ว
        id: item.id || item._id,          
        title: item.title || item.topic || 'No Title', 
        time: item.time || item.startTime || '--:--', 
        endTime: item.endTime || '',     
        completed: item.completed !== undefined 
          ? item.completed 
          : item.status === 'Completed', 
        
        // ✅ ดึงชื่อผู้สูงอายุมาเก็บไว้ใน State ของ Hook เพื่อให้หน้าจอ Schedules เรียกใช้ได้
        elderName: item.elderName || 'ทั่วไป', 
        elderlyId: item.elderlyId || item.elderly,

        // เก็บข้อมูลดิบเผื่อเหลือเผื่อขาด
        originalData: item 
      }));

      setTasks(formattedData);
    } catch (e) {
      console.error("Load Tasks Error:", e);
      setTasks([]); // ล้างค่าเมื่อเกิด Error เพื่อป้องกันข้อมูลเก่าค้าง
    } finally {
      setLoading(false);
    }
  }, [elderId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return { tasks, loading, loadTasks, toggleTaskStatus };
}