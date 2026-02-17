// ใช้กับ mongoose schema เท่านั้น
const validatePasswordSchema = (password) => {
  if (!password) return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;

  return true;
};

module.exports = {
  validatePasswordSchema
};
