# Cloudinary Integration Guide

## Setup Cloudinary

### 1. สมัครบัญชี Cloudinary
- ไปที่ https://cloudinary.com/
- สมัครบัญชี free (ฟรี 25GB storage)

### 2. ได้รับ Credentials
- Login เข้า Cloudinary Dashboard
- ไปที่ Settings → Account → API Keys
- Copy ค่าต่อไปนี้:
  - Cloud Name
  - API Key
  - API Secret

### 3. ตั้ง Environment Variables
สร้าง `.env` file ในโฟลเดอร์ root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
PORT=5000
```

### 4. Install Dependencies
```bash
npm install cloudinary
```

## How It Works

### Flow ของการ Upload ภาพ:

```
Frontend (Admin_User_Main.js)
  ↓
  ├─ User เลือกรูปภาพ
  ├─ Form Data กับ File objects
  ↓
Backend (Server.js)
  ├─ Receive FormData + Files
  ├─ Upload ไป Cloudinary
  │  ├─ profileImage → cloudinary/oldie-care/nurses/profile
  │  ├─ licenseImage → cloudinary/oldie-care/nurses/license
  │  └─ certificateImages → cloudinary/oldie-care/nurses/certificates
  ├─ Get Cloudinary URLs
  ├─ Save URLs ไป MongoDB (ไม่ใช่ไฟล์เอง)
  ↓
Database (MongoDB)
  └─ เก็บ Cloudinary URLs
     ├─ User.profileImage = "https://res.cloudinary.com/.../..."
     ├─ Nurse.licenseImage = "https://res.cloudinary.com/.../..."
     └─ Nurse.certificateImages = ["https://...", "https://..."]
```

## API Response Example

```json
{
  "message": "Nurse created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0912345678",
    "role": "nurse",
    "profileImage": "https://res.cloudinary.com/demo/image/upload/v1234567890/oldie-care/nurses/profile/abc123.jpg",
    "createdAt": "2024-02-03T12:00:00Z"
  },
  "nurse": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "specialization": "Geriatric Care",
    "yearsOfExperience": 5,
    "licenseImage": "https://res.cloudinary.com/demo/image/upload/v1234567890/oldie-care/nurses/license/xyz789.jpg",
    "certificateImages": [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/oldie-care/nurses/certificates/cert1.jpg"
    ]
  }
}
```

## ข้อดี Cloudinary

✅ ไม่ต้อง เก็บรูปบน Server (ประหยัด storage)  
✅ CDN - ดาวน์โหลดเร็ว จากจุดใกล้ที่สุด  
✅ Automatic optimization - ลด file size ให้อัตโนมัติ  
✅ Free tier - 25GB/month  
✅ Easy delete - ลบรูปเก่าได้ง่าย  
✅ URL format สามารถระบุ width, height ได้

## Example URL Transformations

```
Original:
https://res.cloudinary.com/demo/image/upload/v1234567890/oldie-care/nurses/profile/abc123.jpg

Thumbnail (200x200):
https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/v1234567890/oldie-care/nurses/profile/abc123.jpg

Quality optimization (70%):
https://res.cloudinary.com/demo/image/upload/w_200,h_200,q_70/v1234567890/oldie-care/nurses/profile/abc123.jpg

Fetch from MongoDB:
// In your GET endpoint
const nurse = await Nurse.findById(id).populate('userId');
console.log(nurse.licenseImage); // "https://res.cloudinary.com/..."
```

## Troubleshooting

### Error: "CLOUDINARY_CLOUD_NAME is not defined"
→ ตรวจสอบ `.env` file ว่าเซ็ต credentials ถูกไหม

### Error: "Failed to upload to Cloudinary"
→ Check API Key และ API Secret

### Images not showing
→ Cloudinary อาจ block หากใช้ free tier เกิน quota
