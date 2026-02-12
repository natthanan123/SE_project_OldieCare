// src/hooks/nurse/useNurseTasks.js
import { useState, useCallback, useEffect } from 'react';
import { getTasksByElderId } from '../../services/nurseService';

export function useNurseTasks(elderId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasksByElderId(elderId || null); 

      // ✅ ทำการ Mapping ข้อมูลจาก MongoDB ให้ตรงกับที่ UI ต้องการใช้
      const formattedData = (data || []).map(item => ({
        id: item._id,                    // MongoDB ใช้ _id
        title: item.topic || 'No Title', // แปลง topic เป็น title
        time: item.startTime || '--:--', // แปลง startTime เป็น time
        endTime: item.endTime || '',     // ดึง endTime มาด้วย
        completed: item.status === 'Completed', // เช็คสถานะ
        ...item                          // เก็บข้อมูลเดิมไว้เผื่อเรียกใช้อย่างอื่น
      }));

      setTasks(formattedData);
    } catch (e) {
      console.error("Load Tasks Error:", e);
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