
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
  validatePassword
};
