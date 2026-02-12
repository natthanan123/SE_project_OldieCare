import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

const API_URL = "https://se-project-oldiecare.onrender.com";
const EXTERNAL_URL = process.env.REACT_APP_EXTERNAL_API_URL || null;

const AdminUserMain = () => {
const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles, setProfiles] = useState([]); 
  const [error, setError] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null); // เก็บก้อนข้อมูล User ที่จะแก้
  
  const initialFormState = {
    name: "", email: "", phone: "", role: "", password: "",
    // Nurse
    specialization: "", yearsOfExperience: 0,
    education: { degree: "", major: "", university: "", graduationYear: "" },
    license: { number: "", expiryDate: "" },
    // Elderly
    dateOfBirth: "", weight: "", height: "",
    address: { street: "", district: "", province: "", postalCode: "" },
    medicalConditions: [], // ปรับเป็น Array
    medications: [],       // ปรับเป็น Array
    foodAllergies: [],     // เพิ่มตาม JSON อ้างอิง
    diseaseAllergies: [],  // เพิ่มตาม JSON อ้างอิง
    assignedNurse: "",
    // Relative
    relationship: "child", relationshipDetail: "", emergencyContact: false, elderlyId: ""
};

  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null); // รูป Avatar หลัก (URL preview เท่านั้น)
  const [profileImageFile, setProfileImageFile] = useState(null); // File object สำหรับ upload
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerms, setSearchTerms] = useState({ nurse: "", relative: "", elderly: "" });

  
// ================= API =================
const fetchUsers = async () => {
  try {
    const [nursesRes, relativesRes, elderlyRes] = await Promise.all([
      fetch(`${API_URL}/api/users/nurses`),    // เติม s
      fetch(`${API_URL}/api/users/relatives`), // เติม s
      fetch(`${API_URL}/api/users/elderly`)
    ]);
    const [nursesData, relativesData, elderlyData] = await Promise.all([
      nursesRes.ok ? nursesRes.json() : [],
      relativesRes.ok ? relativesRes.json() : [],
      elderlyRes.ok ? elderlyRes.json() : []
    ]);

    const formatProfile = (data, roleName) => (Array.isArray(data) ? data : [])?.map(item => ({
    id: item._id,
    name: item.userId?.name || "No Name",
    role: roleName,
    image: item.userId?.profileImage || '', // ใช้ profileImage ตาม JSON ใหม่
    raw: {
      ...item,
      // ป้องกัน undefined ด้วยการใส่ [] ไว้ก่อน
      skills: item.skills || [],
      medications: item.medications || [],
      medicalConditions: item.medicalConditions || [],
      foodAllergies: item.foodAllergies || [],
      diseaseAllergies: item.diseaseAllergies || []
  }
}));

    setProfiles([
      ...formatProfile(nursesData, 'nurse'),
      ...formatProfile(relativesData, 'relative'),
      ...formatProfile(elderlyData, 'elderly')
    ]);
  } catch (err) {
    console.error("Fetch users failed", err);
  }
};

const handleEditClick = (user) => {
    // นำข้อมูลดิบ (raw) จากที่ดึงมาตอนแรก มาใส่ในฟอร์มแก้ไข
    setEditForm({ ...user }); 
    setIsEditModalOpen(true);
};

const createUserAPI = async (userData, role, fileInputs) => {
  const formData = new FormData();

  // Common
  formData.append("name", userData.name || "");
  formData.append("email", userData.email || "");
  formData.append("phone", userData.phone || "");

  if (editForm.profileImageFile) {
  formData.append("profileImage", editForm.profileImageFile);
}

  // ================= Nurse =================
  if (role === "nurse") {
    formData.append("specialization", userData.specialization || "-");
    formData.append("yearsOfExperience", Number(userData.yearsOfExperience) || 0);
    formData.append("education", JSON.stringify(userData.education || {}));
    formData.append("license", JSON.stringify(userData.license || {}));
    formData.append("skills", JSON.stringify(userData.skills || []));


    if (fileInputs?.licenseImage) {
      formData.append("licenseImage", fileInputs.licenseImage);
    }

    if (fileInputs?.certificateImages) {
      fileInputs.certificateImages.forEach(file => {
        formData.append("certificateImages", file);
      });
    }
  }

  // ================= Elderly =================
  else if (role === "elderly") {
    formData.append("dateOfBirth", userData.dateOfBirth || "");
    formData.append("age", userData.age || 0);
    formData.append("weight", userData.weight || 0);
    formData.append("height", userData.height || 0);

    formData.append("address", JSON.stringify(userData.address || {}));
    formData.append("medicalConditions", JSON.stringify(userData.medicalConditions || []));
    formData.append("medications", JSON.stringify(userData.medications || []));
    formData.append("foodAllergies", JSON.stringify(userData.foodAllergies || []));
    formData.append("diseaseAllergies", JSON.stringify(userData.diseaseAllergies || []));

    if (userData.assignedNurse) {
      formData.append("assignedNurse", userData.assignedNurse);
    }
  }

  // ================= Relative =================
  else if (role === "relative") {
    formData.append("elderlyId", userData.elderlyId || "");
    formData.append("relationship", userData.relationship || "");
    formData.append("relationshipDetail", userData.relationshipDetail || ""); // ✅ เพิ่ม
    formData.append("emergencyContact", String(userData.emergencyContact || false));
  }

  // ⭐ ใช้ route นี้เสมอ
  const endpoint = `${API_URL}/api/users/${role}`;

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Create failed");
  }

  return result;
};



const handleDelete = async (user) => {
  if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) return;

  try {
    let url = "";

    if (user.role === "nurse") {
      url = `${API_URL}/api/users/nurses/${user.id}`;
    } 
    else if (user.role === "elderly") {
      url = `${API_URL}/api/users/elderly/${user.id}`;
    } 
    else if (user.role === "relative") {
      url = `${API_URL}/api/users/relatives/${user.id}`;
    }

    console.log("DELETE URL =", url);  // ⭐ เช็คก่อนยิง

    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    alert("ลบสำเร็จ");
    fetchUsers();

  } catch (err) {
    alert(err.message);
  }
};



useEffect(() => {
  fetchUsers();
}, []);

  // จัดการรูป Profile หลัก - เก็บ File object เพื่อ upload
const handleImageChange = (e) => {
const file = e.target.files[0];
  if (file) {
    // 1. สร้าง URL สำหรับ Preview ในหน้าจอทันที
    setPreviewImage(URL.createObjectURL(file)); 
    
    // 2. เก็บไฟล์จริงลงใน State เพื่อรอส่งเข้า FormData ไปยัง Backend
    // เราจะไม่ทับค่า profileImage (ที่เป็น Link) เพื่อให้ระบบรู้ว่าอันไหนคือ Link เดิม
    setEditForm({ ...editForm, profileImageFile: file }); 
  }
};

  // --- [NEW] จัดการรูปภาพหลายใบ (Docs & Licenses) ---
  const handleMultipleImages = (e, field) => {
    const files = Array.from(e.target.files);
    const newDocs = files?.map(file => ({
      documentUrl: URL.createObjectURL(file),
      file, // keep the original File object for upload
      uploadDate: new Date(),
      // กำหนด Type ตามฟิลด์
      ...(field === 'educationDocuments' ? { documentType: 'degree' } : { licenseType: 'nursing_license' })
    }));

    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...newDocs]
    }));
  };

  const removeImage = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const openModalWithRole = (selectedRole) => {
    setPreviewImage(null);
    setProfileImageFile(null);
    setFormData({ ...initialFormState, role: selectedRole });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  const val = type === 'checkbox' ? checked : value;

  if (name.includes('.')) {
    const parts = name.split('.'); // [medications, 0, name] หรือ [address, street]
    
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        // เช็คว่าเป็น Array หรือ Object
        if (Array.isArray(current[key])) {
          current[key] = [...current[key]];
          current[key][parts[i+1]] = { ...current[key][parts[i+1]] };
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      
      current[parts[parts.length - 1]] = val;
      return newData;
    });
  } else {
    setFormData(prev => ({ ...prev, [name]: val }));
  }
};

 const handleCreate = async () => {
  try {
    const fileInputs = {
      profileImage: profileImageFile, // จาก state ที่คุณเก็บ File object ไว้
      licenseImage: formData.licenseDocuments?.[0]?.file,
      certificateImages: formData.educationDocuments?.map(d => d.file).filter(f => f)
    };

    const result = await createUserAPI(formData, formData.role, fileInputs);
    
    alert("สร้างผู้ใช้สำเร็จ!");
    setIsModalOpen(false);
    fetchUsers(); // Refresh ข้อมูลหน้าจอ
  } catch (err) {
    setError(err.message);
    console.error("Create Error:", err);
  }
};

  const handleConfirmDelete = async () => {
  if (!userToDelete) return;

  try {
    // เรียกใช้ V2 ที่แยกออกมา
    await deleteUserV2(userToDelete);

    // ลบออกจากหน้าจอทันที (UI Update)
    setProfiles(prev => prev.filter(p => 
      (p.id !== userToDelete.id) && (p._id !== userToDelete._id)
    ));

    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    alert("ลบข้อมูลและบัญชีผู้ใช้สำเร็จ");

  } catch (err) {
    console.error("Delete Error:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const handleSaveUpdate = async () => {
  try {
    console.log("====== FRONT UPDATE ======");
    console.log("ROLE =", editForm?.role);
    console.log("ID =", editForm?.raw?._id || editForm?.id);
    console.log("EDIT FORM =", editForm);

    // ⭐ เปลี่ยนชื่อ!!
    const formDataToSend = new FormData();

    if (editForm.profileImageFile) {
      formDataToSend.append("profileImage", editForm.profileImageFile);
    }

    formDataToSend.append("name", editForm.name);
    formDataToSend.append("phone", editForm.phone);

    if (editForm.role === 'nurse') {
      formDataToSend.append("specialization", editForm.raw.specialization || "");
      formDataToSend.append("yearsOfExperience", editForm.raw.experience || 0);
    } 
    else if (editForm.role === 'elderly') {
      formDataToSend.append("dateOfBirth", editForm.raw.dob || "");
      formDataToSend.append("weight", editForm.raw.weight || 0);
      formDataToSend.append("height", editForm.raw.height || 0);
      formDataToSend.append(
        "medications",
        JSON.stringify(editForm.raw.medications || [])
      );
    }

    let rolePath =
      editForm.role === "nurse"
        ? "nurses"
        : editForm.role === "relative"
        ? "relatives"
        : "elderly";

    const url = `${API_URL}/api/users/${rolePath}/${editForm.id}`;

    console.log("🚀 PUT URL =", url);

    // ⭐ log ของจริงที่จะส่ง
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    const response = await fetch(url, {
      method: "PUT",
      body: formDataToSend,
    });

    console.log("STATUS =", response.status);

    const result = await response.json();
    console.log("RESPONSE =", result);

    if (response.ok) {
      alert("อัปเดตสำเร็จ!");
      setIsEditModalOpen(false);
      fetchUsers();
    } else {
      alert("ล้มเหลว: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
};


  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>
      
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box"><img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} /></div>
          <div>Admin User</div>
        </div>
      </div>

      {/* Body Container */}
      <div className="container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="menu-item">
            <span className="menu-icon">
              <i className="fa-solid fa-chart-line"></i>
            </span>{" "}
            Dashboard
          </div>
          <div className="menu-item active">
            <span className="menu-icon">
              <i className="fa-solid fa-people-group"></i>
            </span>{" "}
            User
          </div>
          <div className="menu-item">
            <span className="menu-icon">
              <i className="fa-solid fa-chart-bar"></i>
            </span>{" "}
            Report
          </div>
          
          <div
          className="menu-item"
          onClick={() => navigate("/task")}
          style={{ cursor: "pointer" }}
        >
          <span className="menu-icon">
            <i className="fa-solid fa-tasks"></i>
          </span>
          Task
        </div>

          <div className="menu-item">
            <span className="menu-icon">
              <i className="fa-solid fa-cog"></i>
            </span>{" "}
            Setting
          </div>
        </div>

        <div className="content">
          <div className="user-boxes">
            {[
              { title: "Nurse User", role: "nurse", search: "Search Nurse..." },
              { title: "Kin User", role: "relative", search: "Search Kin..." },
              { title: "Older User", role: "elderly", search: "Search Older..." }
            ]?.map((card) => (
              <div className="user-card" key={card.role}>
                <div className="user-card-header">
                  <h3>{card.title}</h3>
                  <button className="btn plus" onClick={() => openModalWithRole(card.role)}>+</button>
                </div>
                <div className="created-profiles-list">
                  {profiles
                    .filter(p => p.role === card.role)
                    .filter(p => p.name.toLowerCase().includes(searchTerms[card.role].toLowerCase()))
                    ?.map((user) => (
                      <div key={user.id} className="user-profile-row" >
                        <div 
                          className="mini-avatar" 
                          style={{ 
                            backgroundImage: `url(${user.image || 'https://via.placeholder.com/150'})`, 
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#eee'
                          }}
                        ></div>
                        <div className="user-info-text">
                           <span className="u-name">{user.name}</span>
                           <span className="u-role">{card.role}</span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
                        <button 
                          className="btn-edit-icon" 
                          onClick={(e) => {
                            e.stopPropagation();    // ป้องกันการคลิกแถวแล้วเด้งไปหน้า Profile
                            handleEditClick(user);  // เปลี่ยนจาก profile เป็น user ตามตัวแปรใน .map()
                          }} 
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '18px', padding: '5px' }}
                          title="Edit"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        
                        <button 
                        className="btn-delete-item" 
                        onClick={(e) => {
                          e.stopPropagation();    // ป้องกันการคลิกแถวแล้วเด้งไปหน้า Profile
                          console.log("USER =", user);  
                          handleDelete(user); // เปลี่ยนจาก userId เป็น user._id
                        }} 
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>

                      </div>
                      </div>
                    ))}
                </div>
                <input type="text" placeholder={card.search} className="search-input" value={searchTerms[card.role]} onChange={(e) => handleSearchChange(card.role, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New {formData.role.toUpperCase()}</h2>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <div className="modal-body scrollable-modal">
              {/* Profile Image (Avatar) */}
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto', backgroundImage: `url(${previewImage })`, backgroundSize: 'cover', border: '2px solid #ddd', position: 'relative' }}>
                  <label htmlFor="imgInput" style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', color: '#fff', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}><i className="fa-solid fa-camera"></i></label>
                  <input id="imgInput" type="file" hidden onChange={handleImageChange} />
                </div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Profile Photo</p>
              </div>

              {/* --- Common Fields --- */}
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group"><label>Full Name*</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} /></div>
                <div className="form-group"><label>Email*</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} /></div>
                <div className="form-group"><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} /></div>
                <div className="form-group"><label>Password*</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} /></div>
              </div>

              <hr style={{ margin: '20px 0', opacity: 0.2 }} />

              {/* --- Nurse Specific --- */}
              {formData.role === 'nurse' && (
                <>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group"><label>Specialization*</label><input type="text" name="specialization" placeholder="e.g. Geriatric Care" value={formData.specialization} onChange={handleInputChange} required /></div>
                    
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input 
                        type="number" 
                        name="yearsOfExperience"  // แก้จาก "experience"
                        placeholder="e.g. 5" 
                        value={formData.yearsOfExperience} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group"><label>Degree</label><input type="text" name="education.degree" placeholder="e.g. Bachelor" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Major</label><input type="text" name="education.major" placeholder="Nursing Science" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>University</label><input type="text" name="education.university" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Graduation Year</label><input type="number" name="education.graduationYear" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>License Number</label><input type="text" name="license.number" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>License Expire</label><input type="date" name="license.expiryDate" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Check-In</label><input type="time" name="checkIn" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Check-Out</label><input type="time" name="checkOut" onChange={handleInputChange} /></div>
                  </div>

                  {/* Multiple Degree Documents */}
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Education Documents (Degree/Diploma)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {formData.educationDocuments?.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                          <img src={img.documentUrl} alt="doc" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                          <button onClick={() => removeImage('educationDocuments', idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                        </div>
                      ))}
                      <label style={{ width: '70px', height: '70px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', color: '#999' }}>
                        <i className="fa-solid fa-plus"></i>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => handleMultipleImages(e, 'educationDocuments')} />
                      </label>
                    </div>
                  </div>

                  {/* Multiple License Documents */}
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>License Documents (Nursing License/Cert)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {formData.licenseDocuments?.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                          <img src={img.documentUrl} alt="license" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                          <button onClick={() => removeImage('licenseDocuments', idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                        </div>
                      ))}
                      <label style={{ width: '70px', height: '70px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', color: '#999' }}>
                        <i className="fa-solid fa-plus"></i>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => handleMultipleImages(e, 'licenseDocuments')} />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* --- Relative Specific --- */}
              {formData.role === 'relative' && (
              <div className="form-grid">
                {/* 1. เพิ่มช่องเลือก Elderly ID (สำคัญมาก!) */}
                <div className="form-group">
                  <label>Select Elderly (ผู้สูงอายุที่ดูแล)*</label>
                  <select 
                    name="elderlyId" 
                    value={formData.elderlyId || ""} 
                    onChange={handleInputChange} 
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">-- เลือกผู้สูงอายุ --</option>
                    {profiles
                      .filter(p => p.role === 'elderly')
                      .map(elderly => (
                        <option key={elderly._id || elderly.id} value={elderly._id || elderly.id}>
                          {elderly.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* 2. ช่องเลือกความสัมพันธ์ */}
                <div className="form-group">
                  <label>Relationship</label>
                  <select 
                    name="relationship" 
                    value={formData.relationship} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="child">Child (ลูก)</option>
                    <option value="spouse">Spouse (คู่สมรส)</option>
                    <option value="sibling">Sibling (พี่น้อง)</option>
                    <option value="parent">Parent (ผู้ปกครอง)</option> {/* แก้ไข value จาก sibling เป็น parent */}
                    <option value="grandchild">Grandchild (หลาน)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* 3. รายละเอียดถ้าเลือก Other */}
                {formData.relationship === 'other' && (
                  <div className="form-group">
                    <label>Detail</label>
                    <input 
                      type="text" 
                      name="relationshipDetail" 
                      value={formData.relationshipDetail}
                      onChange={handleInputChange} 
                      placeholder="ระบุความสัมพันธ์"
                    />
                  </div>
                )}

                {/* 4. เพิ่มปุ่ม Checkbox สำหรับ Emergency Contact */}
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', gridColumn: '1 / -1' }}>
                  <input 
                    type="checkbox" 
                    name="emergencyContact" 
                    checked={formData.emergencyContact} 
                    onChange={(e) => handleInputChange({
                      target: { name: 'emergencyContact', value: e.target.checked }
                    })}
                    id="emergencyCheck"
                  />
                  <label htmlFor="emergencyCheck" style={{ marginBottom: 0 }}>เป็นผู้ติดต่อฉุกเฉิน (Emergency Contact)</label>
                </div>
              </div>
            )}

              {/* --- Elderly Specific --- */}
              {formData.role === 'elderly' && (
                <>
                  <h4 className="section-title"><i className="fa-solid fa-house-user"></i> Basic & Address</h4>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group"><label>Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Postal Code</label><input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleInputChange} /></div>
                    
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Street Address</label><input type="text" name="address.street" placeholder="Building, Soi, etc." value={formData.address.street} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>District</label><input type="text" name="address.district" value={formData.address.district} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Province</label><input type="text" name="address.province" value={formData.address.province} onChange={handleInputChange} /></div>

                  </div>

                  {/* เพิ่มส่วน Medications */}
                  <h4 className="section-title" style={{ color: '#059669' }}><i className="fa-solid fa-pills"></i> Medications</h4>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f0fdf4', padding: '15px', borderRadius: '8px' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Medication Name</label><input type="text" name="medications.0.name" placeholder="ชื่อยา" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Dosage (Amount)</label><input type="number" name="medications.0.dosage.amount" placeholder="500" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Unit</label><input type="text" name="medications.0.dosage.unit" placeholder="mg / tablet" onChange={handleInputChange} /></div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Frequency</label>
                      <select name="medications.0.frequency" onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="">-- Select --</option>
                        <option value="once daily">Once daily</option>
                        <option value="twice daily">Twice daily</option>
                        <option value="as needed">As needed</option>
                      </select>
                    </div>
                  </div>

                  {/* เพิ่มส่วน Disease Allergies */}
                  <h4 className="section-title" style={{ color: '#dc2626' }}><i className="fa-solid fa-hand-dots"></i> Disease Allergies</h4>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#fef2f2', padding: '15px', borderRadius: '8px' }}>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Allergen (สิ่งที่แพ้)</label><input type="text" name="diseaseAllergies.0.allergen" placeholder="เช่น Penicillin" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Reaction</label><input type="text" name="diseaseAllergies.0.reaction" placeholder="อาการที่แสดง" onChange={handleInputChange} /></div>
                    <div className="form-group">
                      <label>Severity</label>
                      <select name="diseaseAllergies.0.severity" onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-create" onClick={handleCreate}>Create User</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Modal --- */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h3>Confirm Delete?</h3>
            <p>Delete user: <b>{userToDelete?.name}</b></p>
            <div className="modal-footer" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <button className="btn-cancel" onClick={handleCancelDelete}>No</button>
              <button className="btn-create" style={{ backgroundColor: '#d32f2f' }} onClick={handleConfirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}


      {/* --- EDIT MODAL (Sync กับหน้า Post) --- */}
      {isEditModalOpen && editForm && (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Update Profile: {editForm.role.toUpperCase()}</h2>
            <button className="close-x" onClick={() => setIsEditModalOpen(false)}>&times;</button>
          </div>

          <div className="modal-body scrollable-modal">
            {/* Profile Image Section */}
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#eee',
                margin: '0 auto', border: '2px solid #ddd', position: 'relative',
                backgroundImage: `url(${previewImage || editForm.raw?.image || 'https://via.placeholder.com/80'})`,
                backgroundSize: 'cover', backgroundPosition: 'center'
              }}>
                <label htmlFor="editImgInput" style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', color: '#fff', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}>
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input id="editImgInput" type="file" hidden onChange={handleImageChange} />
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Update Photo</p>
            </div>

            {/* --- Common Fields --- */}
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group"><label>Full Name*</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="form-group"><label>Email*</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="form-group"><label>Phone</label>
                <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="form-group"><label>Password (Leave blank to keep current)</label>
                <input type="password" placeholder="********" onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
              </div>
            </div>

            <hr style={{ margin: '20px 0', opacity: 0.2 }} />

            {/* --- Nurse Specific --- */}
            {editForm.role === 'nurse' && (
              <>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group"><label>Specialization*</label>
                    <input type="text" value={editForm.raw?.specialization || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, specialization: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Years of Experience</label>
                    <input type="number" value={editForm.raw?.experience || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, experience: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Degree</label>
                    <input type="text" value={editForm.raw?.education?.degree || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, education: { ...editForm.raw.education, degree: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>Major</label>
                    <input type="text" value={editForm.raw?.education?.major || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, education: { ...editForm.raw.education, major: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>University</label>
                    <input type="text" value={editForm.raw?.education?.university || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, education: { ...editForm.raw.education, university: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>Graduation Year</label>
                    <input type="number" value={editForm.raw?.education?.graduationYear || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, education: { ...editForm.raw.education, graduationYear: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>License Number</label>
                    <input type="text" value={editForm.raw?.license?.number || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, license: { ...editForm.raw.license, number: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>License Expire</label>
                  <input 
                    type="date" 
                    // ใช้ .split('T')[0] เพื่อเอาเฉพาะวันที่ YYYY-MM-DD มาใส่ใน input type="date"
                    value={editForm.raw?.license?.expiryDate?.split('T')[0] || ""} 
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      raw: { 
                        ...editForm.raw, 
                        license: { ...editForm.raw.license, expiryDate: e.target.value } 
                      } 
                    })} 
                  />
                </div>
                  <div className="form-group"><label>Check-In</label>
                    <input type="time" value={editForm.raw?.checkIn || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, checkIn: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Check-Out</label>
                    <input type="time" value={editForm.raw?.checkOut || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, checkOut: e.target.value } })} />
                  </div>
                </div>

                {/* Multiple Degree Documents */}
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Education Documents (Degree/Diploma)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {formData.educationDocuments?.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                          <img src={img.documentUrl} alt="doc" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                          <button onClick={() => removeImage('educationDocuments', idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                        </div>
                      ))}
                      <label style={{ width: '70px', height: '70px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', color: '#999' }}>
                        <i className="fa-solid fa-plus"></i>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => handleMultipleImages(e, 'educationDocuments')} />
                      </label>
                    </div>
                  </div>

                {/* Multiple License Documents */}
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>License Documents (Nursing License/Cert)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {formData.licenseDocuments?.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '70px', height: '70px' }}>
                          <img src={img.documentUrl} alt="license" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                          <button onClick={() => removeImage('licenseDocuments', idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                        </div>
                      ))}
                      <label style={{ width: '70px', height: '70px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '4px', color: '#999' }}>
                        <i className="fa-solid fa-plus"></i>
                        <input type="file" hidden multiple accept="image/*" onChange={(e) => handleMultipleImages(e, 'licenseDocuments')} />
                      </label>
                    </div>
                  </div>
              </>
            )}

            {/* --- Relative Specific --- */}
            {editForm.role === 'relative' && (
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label>Select Elderly (ผู้สูงอายุที่ดูแล)*</label>
                  <select
                    value={editForm.raw?.elderlyId || ""}
                    onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, elderlyId: e.target.value } })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">-- เลือกผู้สูงอายุ --</option>
                    {profiles.filter(p => p.role === 'elderly').map(elderly => (
                      <option key={elderly._id || elderly.id} value={elderly._id || elderly.id}>{elderly.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <select 
                    value={editForm.raw?.relationship || "child"} 
                    onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, relationship: e.target.value } })}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="child">Child (ลูก)</option>
                    <option value="spouse">Spouse (คู่สมรส)</option>
                    <option value="sibling">Sibling (พี่น้อง)</option>
                    <option value="parent">Parent (ผู้ปกครอง)</option>
                    <option value="grandchild">Grandchild (หลาน)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', gridColumn: '1 / -1' }}>
                  <input 
                    type="checkbox" 
                    id="editEmergencyCheck"
                    checked={editForm.raw?.emergencyContact || false} 
                    onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, emergencyContact: e.target.checked } })} 
                  />
                  <label htmlFor="editEmergencyCheck" style={{ marginBottom: 0 }}>เป็นผู้ติดต่อฉุกเฉิน (Emergency Contact)</label>
                </div>
              </div>
            )}

            {/* --- Elderly Specific --- */}
            {editForm.role === 'elderly' && (
              <>
                <h4 className="section-title"><i className="fa-solid fa-house-user"></i> Basic & Address</h4>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group"><label>Date of Birth</label>
                    <input type="date" value={editForm.raw?.dob?.split('T')[0] || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, dob: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Weight (kg)</label>
                    <input type="number" value={editForm.raw?.weight || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, weight: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Height (cm)</label>
                    <input type="number" value={editForm.raw?.height || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, height: e.target.value } })} />
                  </div>
                  <div className="form-group"><label>Postal Code</label>
                    <input type="text" value={editForm.raw?.address?.postalCode || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, address: { ...editForm.raw.address, postalCode: e.target.value } } })} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Street Address</label>
                    <input type="text" value={editForm.raw?.address?.street || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, address: { ...editForm.raw.address, street: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>District</label>
                    <input type="text" value={editForm.raw?.address?.district || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, address: { ...editForm.raw.address, district: e.target.value } } })} />
                  </div>
                  <div className="form-group"><label>Province</label>
                    <input type="text" value={editForm.raw?.address?.province || ""} onChange={(e) => setEditForm({ ...editForm, raw: { ...editForm.raw, address: { ...editForm.raw.address, province: e.target.value } } })} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Assigned Nurse</label>
                    <select
                      name="assignedNurse"
                      value={formData.assignedNurse}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <option value="">-- Select Nurse --</option>

                      {profiles
                        .filter(p => p.role === "nurse")
                        .map(nurse => (
                          <option key={nurse.raw?._id} value={nurse.raw?._id}>
                            {nurse.name}
                          </option>
                      ))}
                    </select>

                  </div>
                </div>

                <h4 className="section-title" style={{ color: '#059669' }}><i className="fa-solid fa-pills"></i> Medications</h4>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f0fdf4', padding: '15px', borderRadius: '8px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Medication Name</label>
                    <input type="text" value={editForm.raw?.medications?.[0]?.name || ""} onChange={(e) => {
                      let meds = [...(editForm.raw.medications || [{}])];
                      meds[0] = { ...meds[0], name: e.target.value };
                      setEditForm({ ...editForm, raw: { ...editForm.raw, medications: meds } });
                    }} />
                  </div>
                  <div className="form-group"><label>Dosage</label>
                    <input type="number" value={editForm.raw?.medications?.[0]?.dosage?.amount || ""} onChange={(e) => {
                      let meds = [...(editForm.raw.medications || [{}])];
                      meds[0].dosage = { ...meds[0].dosage, amount: e.target.value };
                      setEditForm({ ...editForm, raw: { ...editForm.raw, medications: meds } });
                    }} />
                  </div>
                  <div className="form-group"><label>Unit</label>
                    <input type="text" value={editForm.raw?.medications?.[0]?.dosage?.unit || ""} onChange={(e) => {
                      let meds = [...(editForm.raw.medications || [{}])];
                      meds[0].dosage = { ...meds[0].dosage, unit: e.target.value };
                      setEditForm({ ...editForm, raw: { ...editForm.raw, medications: meds } });
                    }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Frequency</label>
                    <select 
                      value={editForm.raw?.medications?.[0]?.frequency || ""} 
                      onChange={(e) => {
                        let meds = [...(editForm.raw.medications || [{}])];
                        meds[0].frequency = e.target.value;
                        setEditForm({ ...editForm, raw: { ...editForm.raw, medications: meds } });
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="">-- Select --</option>
                      <option value="once daily">Once daily</option>
                      <option value="twice daily">Twice daily</option>
                      <option value="as needed">As needed</option>
                    </select>
                  </div>
                </div>

                <h4 className="section-title" style={{ color: '#dc2626' }}><i className="fa-solid fa-hand-dots"></i> Disease Allergies</h4>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#fef2f2', padding: '15px', borderRadius: '8px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Allergen</label>
                    <input type="text" value={editForm.raw?.diseaseAllergies?.[0]?.allergen || ""} onChange={(e) => {
                      let allergies = [...(editForm.raw.diseaseAllergies || [{}])];
                      allergies[0].allergen = e.target.value;
                      setEditForm({ ...editForm, raw: { ...editForm.raw, diseaseAllergies: allergies } });
                    }} />
                  </div>
                  <div className="form-group"><label>Reaction</label>
                    <input type="text" value={editForm.raw?.diseaseAllergies?.[0]?.reaction || ""} onChange={(e) => {
                      let allergies = [...(editForm.raw.diseaseAllergies || [{}])];
                      allergies[0].reaction = e.target.value;
                      setEditForm({ ...editForm, raw: { ...editForm.raw, diseaseAllergies: allergies } });
                    }} />
                  </div>
                  <div className="form-group">
                    <label>Severity</label>
                    <select 
                      value={editForm.raw?.diseaseAllergies?.[0]?.severity || "mild"} 
                      onChange={(e) => {
                        let allergies = [...(editForm.raw.diseaseAllergies || [{}])];
                        allergies[0].severity = e.target.value;
                        setEditForm({ ...editForm, raw: { ...editForm.raw, diseaseAllergies: allergies } });
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button className="btn-create" onClick={handleSaveUpdate}>Update User</button>
          </div>
        </div>
      </div>
    )}

      {/* Bottom Bar และ Chat Widget คงเดิม */}
      <div className="bottombar">
        <div className="bottom-item"><div><i className="fa-solid fa-chart-line"></i></div><div>Dashboard</div></div>
        <div className="bottom-item active"><div><i className="fa-solid fa-people-group"></i></div><div>User</div></div>
        <div className="bottom-item"><div><i className="fa-solid fa-chart-bar"></i></div><div>Report</div></div>
        <div className="bottom-item"><div><i className="fa-solid fa-tasks"></i></div><div>Task</div></div>
        <div className="bottom-item"><div><i className="fa-solid fa-cog"></i></div><div>Setting</div></div>
      </div>

      <Link to="/chat" className="chat-widget" style={{ textDecoration: 'none' }}>
        <div className="chat-icon"><i className="fa-solid fa-comment-dots"></i></div>
        <div className="chat-text">Messages</div>
      </Link>
    
    </div>
    
  );
};

export default AdminUserMain;