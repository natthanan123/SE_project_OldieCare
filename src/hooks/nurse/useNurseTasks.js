// src/hooks/nurse/useNurseTasks.js
import { useState, useCallback, useEffect } from 'react';
import { getTasksByElderId } from '../../services/nurseService';

export function useNurseTasks(elderId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      // เพิ่มความปลอดภัย: ถ้าไม่มี elderId ให้ส่ง null เข้าไป หรือดึงข้อมูลภาพรวมแทน
      const data = await getTasksByElderId(elderId || null); 
      setTasks(data || []);
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