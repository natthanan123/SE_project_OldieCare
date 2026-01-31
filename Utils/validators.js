// Validator สำหรับตรวจสอบ URL รูปภาพ
const validateImageUrl = (url) => {
  if (!url) return true; // อนุญาต null/undefined
  
  // Regex เช็ค URL format
  const urlRegex = /^(https?:\/\/.+)/i;
  if (!urlRegex.test(url)) {
    return false;
  }
  
  // Regex เช็ค extension ของรูปภาพ
  const imageExtRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)(\?.*)?$/i;
  if (!imageExtRegex.test(url)) {
    return false;
  }
  
  return true;
};

// Validator สำหรับตรวจสอบรหัสผ่าน
const validatePassword = (password) => {
  // เช็ค≥ 8 ตัว
  if (password.length < 8) {
    return false;
  }
  
  // เช็ค ตัวใหญ่ (Uppercase)
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  
  // เช็ค ตัวเลข (Digits)
  if (!/[0-9]/.test(password)) {
    return false;
  }
  
  // เช็ค สัญลักษณ์ (Special characters)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return false;
  }
  
  return true;
};

module.exports = {
  validateImageUrl,
  validatePassword
};
