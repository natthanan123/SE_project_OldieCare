function recommendNurses(nurses = []) {
  if (!Array.isArray(nurses)) return [];

  const MAX_PATIENTS = 3;

  const normalized = nurses.map(n => {
    const id = n._id || n.id || null;
    // support populated 'user' or populated 'userId'
    const userObj = n.user || n.userId || null;
    const name = (userObj?.name || n.name || '').toString();
    const profileImage = userObj?.profileImage || null;
    const patientCount = typeof n.patientCount === 'number' ? n.patientCount : 0;
    return { id, name, profileImage, patientCount, raw: n };
  });

  // ตัดพยาบาลที่เต็มออกไป
  const available = normalized.filter(n => n.patientCount < MAX_PATIENTS);

  // sort: ชื่อก่อน (A-Z) แล้วค่อย sort ตาม patientCount (min ก่อน)
  available.sort((a, b) => {
    const nameCompare = (a.name || '').localeCompare(b.name || '');
    if (nameCompare !== 0) return nameCompare;
    return a.patientCount - b.patientCount;
  });

  // ส่งให้ frontend (รวม profileImage)
  return available.map(n => ({
    id: n.id,
    name: n.name,
    patientCount: n.patientCount,
    profileImage: n.profileImage,
    isFull: false
  }));
}

module.exports = { recommendNurses };
