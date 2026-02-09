import { useEffect, useState } from 'react';
import { getAssignedElders } from '../../services/nurseService';
import { getActiveSOS } from '../../services/sosService';

export function useNurseHome() {
  const [elders, setElders] = useState([]);
  const [sosAlert, setSosAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    try {
      setLoading(true);
      setError(null); // ล้างค่า error ก่อนเริ่มโหลดใหม่

      // เปลี่ยนมาดึงแยกกันเพื่อไม่ให้ SOS พังแล้วดึงรายชื่อคนแก่ไม่ได้
      const elderList = await getAssignedElders();
      const sos = await getActiveSOS();

      setElders(elderList || []);
      setSosAlert(sos || null);
    } catch (e) {
      console.error("Home Load Error:", e); // พิมพ์ Error ลง console เพื่อดูสาเหตุจริง
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }

  return {
    greeting: 'Good Morning, Nurse',
    elders,
    sosAlert,
    taskCount: elders ? elders.length : 0,
    loading,
    error,
  };
}