# 🔐 JWT Token System - การใช้งาน

## 📋 Requirements

- `jsonwebtoken` (ทำการเพิ่มไปในแล้ว)
- `.env` file ต้องมี `JWT_SECRET`

## ⚙️ Configuration

### 1. ตั้งค่า JWT_SECRET ใน .env
```
JWT_SECRET=your-super-secret-key-change-in-production
```

### 2. Token Expiry ตามแต่ละ Role:
- **Elderly**: 30 วัน (ไม่มี idle logout)
- **Relative**: 30 วัน (ไม่มี idle logout)
- **Nurse**: 12 ชม (idle timeout 2 ชม)

---

## 🔑 API Endpoints

### 1. Login - สร้าง JWT Token

**Request:**
```
POST /login
Content-Type: application/json

{
  "identifier": "email หรือ username",
  "password": "รหัสผ่าน"
}
```

**Response (200):**
```json
{
  "message": "Login success",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "nurse",
    "phone": "0812345678",
    "profileImage": null,
    "createdAt": "2026-02-17T...",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-02-18T12:30:00.000Z",
  "expiresInSeconds": 43200,
  "idleTimeout": 7200
}
```

**Response (401) - Wrong password:**
```json
{
  "message": "Wrong password"
}
```

**Response (404) - User not found:**
```json
{
  "message": "User not found"
}
```

---

### 2. Refresh Token - ขยายอายุ Token

**Request:**
```
POST /refresh-token
Content-Type: application/json

{
  "token": "old_jwt_token_here"
}
```

**Response (200):**
```json
{
  "message": "Token refreshed",
  "token": "new_jwt_token_here",
  "expiresAt": "2026-02-18T12:30:00.000Z",
  "expiresInSeconds": 43200
}
```

---

## 🛡️ Protected Routes (ต้องใช้ Token)

### อัพเดท routes ให้ใช้ middleware `authMiddleware`

**ตัวอย่าง - ปกป้อง route:**
```javascript
const { authMiddleware, roleMiddleware } = require('../Login/authMiddleware');

// ป้องกัน route - ต้องมี valid token
router.get('/api/users/nurses', authMiddleware, async (req, res) => {
  // req.user.userId
  // req.user.role
});

// ป้องกัน + check role
router.post('/api/admins', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  // Admin only
});
```

---

## 📱 Client-Side Usage

### 1. Login & Save Token
```javascript
const response = await fetch('http://localhost:5000/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'nurse@example.com',
    password: 'Password123!'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('expiresAt', data.expiresAt);
localStorage.setItem('idleTimeout', data.idleTimeout);
```

### 2. ใช้ Token ในทุก Request (Protected Routes)
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
};

const response = await fetch('http://localhost:5000/api/users/nurses', {
  method: 'GET',
  headers
});
```

### 3. Refresh Token เมื่อ Expire (Optional)
```javascript
const refreshToken = async (oldToken) => {
  const response = await fetch('http://localhost:5000/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: oldToken })
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
  }
};
```

### 4. Auto-Logout on Idle (Nurse only)
```javascript
const idleTimeout = localStorage.getItem('idleTimeout') * 1000; // milliseconds

let idleTimer;
const resetIdleTimer = () => {
  clearTimeout(idleTimer);
  
  if (idleTimeout) { // Only for Nurse
    idleTimer = setTimeout(() => {
      alert('Session expired due to inactivity');
      localStorage.clear();
      window.location.href = '/login';
    }, idleTimeout);
  }
};

// เรียกใช้เมื่อ user active
document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

resetIdleTimer(); // Initialize
```

---

## 🔒 Error Responses

### 401 - No Token
```json
{
  "message": "Access token is required",
  "code": "NO_TOKEN"
}
```

### 401 - Invalid Format
```json
{
  "message": "Invalid token format. Use: Bearer <token>",
  "code": "INVALID_FORMAT"
}
```

### 401 - Token Expired
```json
{
  "message": "Token has expired",
  "code": "TOKEN_EXPIRED"
}
```

### 401 - Invalid Token
```json
{
  "message": "Invalid token",
  "code": "INVALID_TOKEN"
}
```

### 403 - Forbidden (Role check)
```json
{
  "message": "This action requires one of these roles: admin",
  "code": "FORBIDDEN"
}
```

---

## 📝 Files Structure

```
Login/
├── Auth.js              ✅ Login endpoint + Refresh token
├── tokenConfig.js       ✅ Token expiry config per role
├── tokenHandler.js      ✅ JWT generate/verify/refresh
├── authMiddleware.js    ✅ Route protection middleware
└── Reset_Password.js    (commented - not using yet)
```

---

## ✅ TODO - Next Steps

น้อต้องสำหรับอัพเดท routes ให้ใช้ JWT:
1. อัพเดท GET/POST/PUT/DELETE routes ให้ใช้ `authMiddleware`
2. เพิ่ม role check ที่จำเป็น เช่น admin-only routes
3. Implement logout endpoint (optional)
4. Implement session tracking สำหรับ idle timeout (Redis recommended)

