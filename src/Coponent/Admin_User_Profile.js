import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

// URL ของ API อ้างอิงจาก Admin_User_Main.txt
const API_URL = "https://se-project-oldiecare.onrender.com";

const Admin_User_Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    // State สำหรับเก็บไฟล์จริงเพื่อส่งเข้า Server
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);
    const [certificateFiles, setCertificateFiles] = useState([]);
    
    // ดึงข้อมูล User และกำหนดค่าเริ่มต้นให้ครบทุก Field
    const [userData, setUserData] = useState({
        name: location.state?.name || "",
        email: location.state?.email || "",
        phone: location.state?.phone || "",
        role: location.state?.role || "nurse",
        password: location.state?.password || "",
        image: location.state?.image || null,

        // Nurse Specific
        specialization: location.state?.specialization || "",
        yearsOfExperience: location.state?.yearsOfExperience || 0,
        education: location.state?.education || { degree: "", major: "", university: "", graduationYear: "" },
        license: location.state?.license || { number: "", expiryDate: "" },
        educationDocuments: location.state?.educationDocuments || [],
        licenseDocuments: location.state?.licenseDocuments || [],
        checkIn: location.state?.checkIn || "",
        checkOut: location.state?.checkOut || "",

        // Relative Specific
        relationship: location.state?.relationship || "child",
        relationshipDetail: location.state?.relationshipDetail || "",
        emergencyContact: location.state?.emergencyContact || false,

        // Elderly Specific
        dob: location.state?.dob || "",
        weight: location.state?.weight || "",
        height: location.state?.height || "",
        address: location.state?.address || { street: "", district: "", province: "", postalCode: "" },
        medications: location.state?.medications || [],
        diseaseAllergies: location.state?.diseaseAllergies || []
    });

    const [previewImage, setPreviewImage] = useState(userData.image);

    // ฟังก์ชันอัปเดตข้อมูลส่งไปยัง Backend
    // ... (import และ state ด้านบนคงเดิม)

const updateUserProfileV2 = async () => {
    try {
        const formData = new FormData();
        // กำหนด Endpoint ให้ตรงกับ Backend
        const pluralRole = userData.role === 'nurse' ? 'nurses' :
                           userData.role === 'elderly' ? 'elderlies' : 'relatives';

        // 1. ข้อมูลพื้นฐาน (เข้า User Model)
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone || "");

        // 2. ข้อมูลตาม Role (เข้า Specific Model)
        if (userData.role === 'nurse') {
            formData.append('specialization', userData.specialization);
            formData.append('yearsOfExperience', Number(userData.yearsOfExperience) || 0); // แปลงเป็น Number
            formData.append('education', JSON.stringify(userData.education));
            formData.append('license', JSON.stringify(userData.license));
            formData.append('checkIn', userData.checkIn);
            formData.append('checkOut', userData.checkOut);
            
            // ส่งไฟล์ภาพ (ชื่อ field ต้องตรงกับที่ multer ใน backend รับ: upload.fields([...]))
            if (licenseFile) formData.append('licenseImage', licenseFile);
            certificateFiles.forEach(file => formData.append('certificateImages', file));
        } 
        else if (userData.role === 'elderly') {
            formData.append('dob', userData.dob);
            formData.append('weight', Number(userData.weight) || 0); // แปลงเป็น Number
            formData.append('height', Number(userData.height) || 0); // แปลงเป็น Number
            formData.append('address', JSON.stringify(userData.address));
            formData.append('medications', JSON.stringify(userData.medications));
            formData.append('diseaseAllergies', JSON.stringify(userData.diseaseAllergies));
        }
        else if (userData.role === 'relative') {
            formData.append('relationship', userData.relationship);
            formData.append('relationshipDetail', userData.relationshipDetail);
            formData.append('emergencyContact', String(userData.emergencyContact)); // ส่งเป็น string "true"/"false"
        }

        // 3. รูปโปรไฟล์ (ส่งเข้า User Model)
        if (profileImageFile) formData.append('profileImage', profileImageFile);

        const response = await fetch(`${API_URL}/api/users/${pluralRole}/${id}`, {
            method: 'PUT',
            body: formData, // ห้ามใส่ Header Content-Type เอง เมื่อใช้ FormData
        });

        const result = await response.json();
        if (response.ok) {
            alert("อัปเดตข้อมูลสำเร็จ!");
            navigate('/'); // หรือตาม path ที่คุณใช้
        } else {
            throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึก");
        }
    } catch (error) {
        console.error("Update Error:", error);
        alert(`ไม่สามารถบันทึกได้: ${error.message}`);
    }
};

// เพิ่มฟังก์ชันใหม่สำหรับ Update โดยเฉพาะ
const handleProfileUpdate = async () => {
    try {
        const formData = new FormData();
        const role = userData.role;
        const pluralRole = role === 'nurse' ? 'nurses' : role === 'elderly' ? 'elderlies' : 'relatives';

        // 1. ข้อมูลพื้นฐาน (User Model)
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone || "");

        // 2. ข้อมูลเฉพาะตาม Role (ส่งเป็น String เพื่อให้ Backend safeParse ได้)
        if (role === 'nurse') {
            formData.append('specialization', userData.specialization);
            formData.append('yearsOfExperience', userData.yearsOfExperience);
            formData.append('education', JSON.stringify(userData.education));
            formData.append('license', JSON.stringify(userData.license));
            formData.append('checkIn', userData.checkIn);
            formData.append('checkOut', userData.checkOut);
            if (licenseFile) formData.append('licenseImage', licenseFile);
        } 
        else if (role === 'elderly') {
            formData.append('dateOfBirth', userData.dob);
            formData.append('weight', userData.weight);
            formData.append('height', userData.height);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('medications', JSON.stringify(userData.medications));
            formData.append('diseaseAllergies', JSON.stringify(userData.diseaseAllergies));
        }
        else if (role === 'relative') {
            formData.append('relationship', userData.relationship);
            formData.append('relationshipDetail', userData.relationshipDetail);
            formData.append('emergencyContact', String(userData.emergencyContact));
        }

        // 3. ไฟล์รูปโปรไฟล์
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile);
        }

        const response = await fetch(`${API_URL}/api/users/${pluralRole}/${id}`, {
            method: 'PUT',
            body: formData, // Browser จะจัดการ Content-Type ให้เองเมื่อเป็น FormData
        });

        const result = await response.json();

        if (response.ok) {
          alert("บันทึกการเปลี่ยนแปลงสำเร็จ!");
          setIsEditing(false);
          navigate('/'); // แก้จาก '/admin/users' เป็น '/'

        } else {
            throw new Error(result.message || "ไม่สามารถบันทึกได้");
        }
    } catch (error) {
        console.error("Update Error:", error);
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
};
// เพิ่มฟังก์ชันนี้ลงใน Admin_User_Profile.txt
const syncDataFromMain = () => {
    const raw = location.state?.raw;
    if (raw) {
        setUserData(prev => ({
            ...prev,
            // ข้อมูลเฉพาะตามประเภทที่อยู่ใน raw
            specialization: raw.specialization || prev.specialization,
            yearsOfExperience: raw.yearsOfExperience || prev.yearsOfExperience,
            education: raw.education || prev.education,
            license: raw.license || prev.license,
            checkIn: raw.checkIn || prev.checkIn,
            checkOut: raw.checkOut || prev.checkOut,
            
            // ข้อมูลผู้สูงอายุ
            dob: raw.dateOfBirth || prev.dob,
            weight: raw.weight || prev.weight,
            height: raw.height || prev.height,
            address: raw.address || prev.address,
            medications: raw.medications || prev.medications,
            diseaseAllergies: raw.diseaseAllergies || prev.diseaseAllergies,

            // ข้อมูลญาติ
            relationship: raw.relationship || prev.relationship,
            relationshipDetail: raw.relationshipDetail || prev.relationshipDetail,
            emergencyContact: raw.emergencyContact ?? prev.emergencyContact,
        }));
    }
};

// เรียกใช้งานเมื่อเปิดหน้า
useEffect(() => {
    syncDataFromMain();
}, [location.state]);

// ปรับปรุงฟังก์ชันจัดการ Input สำหรับ Nested Object ให้เสถียรขึ้น
const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name.includes('.')) {
        const parts = name.split('.');
        setUserData(prev => {
            const newState = { ...prev };
            let current = newState;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                // ตรวจสอบว่ามี Object ชั้นถัดไปไหม ถ้าไม่มีให้สร้างรอไว้เลย
                if (!current[part]) {
                    current[part] = isNaN(parts[i+1]) ? {} : []; 
                }
                // Copy object/array ชั้นนั้นๆ เพื่อรักษา Immutability
                current[part] = Array.isArray(current[part]) 
                    ? [...current[part]] 
                    : { ...current[part] };
                current = current[part];
            }
            current[parts[parts.length - 1]] = val;
            return newState;
        });
    } else {
        setUserData(prev => ({ ...prev, [name]: val }));
    }
};

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImageFile(file); // เก็บไฟล์จริงไว้ส่ง API
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };
    useEffect(() => {
    // Cleanup function
    return () => {
        if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }
    };
}, [previewImage]);
    const handleMultipleImages = (e, field) => {
        const files = Array.from(e.target.files);
        if (field === 'educationDocuments') {
            setCertificateFiles(prev => [...prev, ...files]);
        }
        
        const newPreviews = files.map(file => ({
            documentUrl: URL.createObjectURL(file),
            uploadDate: new Date()
        }));
        setUserData(prev => ({ ...prev, [field]: [...prev[field], ...newPreviews] }));
    };

    return (
        <div className="admin-user-wrapper">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>

            <div className="topbar">
                <div className="topbar-left">
                    <div className="logo-box">
                        <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontWeight: 'bold' }}>User Management / Profile</div>
                </div>
            </div>

            <div className="container">
                <div className="sidebar">
                    <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard</div>
                    <div className="menu-item active"><span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> User</div>
                    <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Report</div>
                    <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Task</div>
                    <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Setting</div>
                </div>

                <div className="content">
                    <div className="settings-container">
                        <section className="settings-card">
                            <div className="card-header">
                                <h3>{userData.role.toUpperCase()} Profile Details</h3>
                                {/* เปลี่ยนมาเรียกใช้ updateUserProfileV2 */}
                                <button className="btn-create" onClick={updateUserProfileV2}>Save Changes</button>
                            </div>
                            
                            <div className="profile-content">
                                <div className="avatar-edit">
                                    <div className="avatar-large" style={{ backgroundImage: `url(${previewImage || 'https://via.placeholder.com/150'})`, backgroundSize: 'cover', border: '3px solid #2563eb' }}>
                                        <label className="camera-icon" style={{ cursor: 'pointer' }}>
                                            <i className="fa-solid fa-camera"></i>
                                            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>

                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group"><label>Full Name</label><input type="text" name="name" value={userData.name} onChange={handleInputChange} /></div>
                                    <div className="form-group"><label>Email Address</label><input type="email" name="email" value={userData.email} onChange={handleInputChange} /></div>
                                    <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={userData.phone} onChange={handleInputChange} /></div>
                                    <div className="form-group"><label>Role (Fixed)</label><input type="text" value={userData.role.toUpperCase()} readOnly style={{ backgroundColor: '#f5f5f5' }} /></div>
                                </div>
                            </div>
                        </section>

                        <section className="settings-card" style={{ marginTop: '20px' }}>
                            <div className="card-header"><h3>Additional Information</h3></div>
                            <div className="profile-content">
                                {userData.role === 'nurse' && (
                                    <>
                                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <div className="form-group"><label>Degree</label><input type="text" name="education.degree" value={userData.education.degree} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>University</label><input type="text" name="education.university" value={userData.education.university} onChange={handleInputChange} /></div>
                                            <div className="form-group">
                                                <label>License Image</label>
                                                <input type="file" onChange={(e) => setLicenseFile(e.target.files[0])} accept="image/*" />
                                            </div>
                                            <div className="form-group"><label>Check-In Time</label><input type="time" name="checkIn" value={userData.checkIn} onChange={handleInputChange} /></div>
                                        </div>
                                        <div className="form-group" style={{ marginTop: '20px' }}>
                                            <label>Documents (Degrees & Licenses)</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                                {[...userData.educationDocuments, ...userData.licenseDocuments].map((doc, idx) => (
                                                    <div key={idx} style={{ position: 'relative' }}>
                                                        <img src={doc.documentUrl} alt="doc" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                                <label style={{ width: '80px', height: '80px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '8px' }}>
                                                    <i className="fa-solid fa-plus"></i>
                                                    <input type="file" hidden multiple onChange={(e) => handleMultipleImages(e, 'educationDocuments')} />
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {userData.role === 'relative' && (
                                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div className="form-group">
                                            <label>Relationship</label>
                                            <select name="relationship" value={userData.relationship} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                                <option value="child">Child (ลูก)</option>
                                                <option value="spouse">Spouse (คู่สมรส)</option>
                                                <option value="sibling">Sibling (พี่น้อง)</option>
                                                <option value="parent">Parent (ผู้ปกครอง)</option>
                                                <option value="grandchild">Grandchild (หลาน)</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        {userData.relationship === 'other' && (
                                            <div className="form-group"><label>Detail</label><input type="text" name="relationshipDetail" value={userData.relationshipDetail} onChange={handleInputChange} /></div>
                                        )}
                                    </div>
                                )}

                                {userData.role === 'elderly' && (
                                    <div className="elderly-info-container">
                                        <h4 className="section-title"><i className="fa-solid fa-house-user"></i> Basic & Address</h4>
                                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                                            <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={userData.dob || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>Weight (kg)</label><input type="number" name="weight" value={userData.weight || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>Height (cm)</label><input type="number" name="height" value={userData.height || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>Postal Code</label><input type="text" name="address.postalCode" value={userData.address?.postalCode || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Street Address</label><input type="text" name="address.street" value={userData.address?.street || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>District</label><input type="text" name="address.district" value={userData.address?.district || ""} onChange={handleInputChange} /></div>
                                            <div className="form-group"><label>Province</label><input type="text" name="address.province" value={userData.address?.province || ""} onChange={handleInputChange} /></div>
                                        </div>

                                        <h4 className="section-title" style={{ color: '#059669' }}><i className="fa-solid fa-pills"></i> Medications</h4>
                                        <div className="medical-box" style={{ background: '#f0fdf4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Medication Name</label>
                                                    <input type="text" name="medications.0.name" value={userData.medications?.[0]?.name || ""} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Dosage (Amount)</label>
                                                    <input type="number" name="medications.0.dosage.amount" value={userData.medications?.[0]?.dosage?.amount || ""} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Unit</label>
                                                    <input type="text" name="medications.0.dosage.unit" value={userData.medications?.[0]?.dosage?.unit || ""} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <h4 className="section-title" style={{ color: '#dc2626' }}><i className="fa-solid fa-hand-dots"></i> Disease Allergies</h4>
                                        <div className="allergy-box" style={{ background: '#fef2f2', padding: '20px', borderRadius: '8px' }}>
                                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                                    <label>Allergen (สิ่งที่แพ้)</label>
                                                    <input type="text" name="diseaseAllergies.0.allergen" value={userData.diseaseAllergies?.[0]?.allergen || ""} onChange={handleInputChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Severity</label>
                                                    <select name="diseaseAllergies.0.severity" value={userData.diseaseAllergies?.[0]?.severity || "mild"} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                                        <option value="mild">Mild</option>
                                                        <option value="moderate">Moderate</option>
                                                        <option value="severe">Severe</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                            <button onClick={() => navigate(-1)} className="btn-cancel">
                                <i className="fa-solid fa-arrow-left"></i> Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bottombar">
                <div className="bottom-item"><div><i className="fa-solid fa-chart-line"></i></div><div>Dashboard</div></div>
                <div className="bottom-item active"><div><i className="fa-solid fa-people-group"></i></div><div>User</div></div>
                <div className="bottom-item"><div><i className="fa-solid fa-chart-bar"></i></div><div>Report</div></div>
                <div className="bottom-item"><div><i className="fa-solid fa-tasks"></i></div><div>Task</div></div>
                <div className="bottom-item"><div><i className="fa-solid fa-cog"></i></div><div>Setting</div></div>
            </div>
        </div>
    );
};

export default Admin_User_Profile;