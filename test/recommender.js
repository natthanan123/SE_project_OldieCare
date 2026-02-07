function recommendNurses(nurses = []) {
  if (!Array.isArray(nurses)) return [];

  const MAX_PATIENTS = 3;

  const normalized = nurses.map(n => ({
    id: n._id || n.id || null,
    name: (n.user?.name || n.name || '').toString(),
    patientCount: typeof n.patientCount === 'number' ? n.patientCount : 0,
    raw: n
  }));

  // ✅ ตัดพยาบาลที่เต็มออกไป
  const available = normalized.filter(n => n.patientCount < MAX_PATIENTS);

  // ✅ sort: ชื่อก่อน (A-Z) แล้วค่อย sort ตาม patientCount (min ก่อน)
  available.sort((a, b) => {
    const nameCompare = (a.name || '').localeCompare(b.name || '');
    if (nameCompare !== 0) return nameCompare;

    // ถ้าชื่อเหมือนกัน ค่อยดู patientCount
    return a.patientCount - b.patientCount;
  });

  // ส่งให้ frontend
  return available.map(n => ({
    id: n.id,
    name: n.name,
    patientCount: n.patientCount,
    isFull: false
  }));
}

module.exports = { recommendNurses };
