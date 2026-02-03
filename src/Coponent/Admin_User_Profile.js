import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

const Admin_User_Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // ดึงข้อมูล User และกำหนดค่าเริ่มต้นให้ครบทุก Field เพื่อกัน Error
  const [userData, setUserData] = useState({
    name: location.state?.name || "",
    email: location.state?.email || "",
    phone: location.state?.phone || "",
    role: location.state?.role || "nurse",
    password: location.state?.password || "",
    image: location.state?.image || null,
    
    // Nurse Specific
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
    address: location.state?.address || { street: "", district: "", province: "", postalCode: "" }
  });

  const [previewImage, setPreviewImage] = useState(userData.image);

  // ฟังก์ชันจัดการ Input แบบรวม (รองรับ nested object เช่น address.province)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setUserData(prev => ({ ...prev, image: url }));
    }
  };

  // จัดการรูปภาพเอกสารหลายใบ
  const handleMultipleImages = (e, field) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      documentUrl: URL.createObjectURL(file),
      uploadDate: new Date(),
      ...(field === 'educationDocuments' ? { documentType: 'degree' } : { licenseType: 'nursing_license' })
    }));
    setUserData(prev => ({ ...prev, [field]: [...prev[field], ...newDocs] }));
  };

  const removeImage = (field, index) => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log("Saving Updated Data:", userData);
    alert("Profile updated successfully!");
    navigate(-1);
  };

  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>

      {/* --- TOPBAR --- */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
             <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 'bold' }}>User Management / Profile</div>
        </div>
      </div>

      <div className="container">
        {/* --- SIDEBAR --- */}
        <div className="sidebar">
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard</div>
          <div className="menu-item active"><span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> User</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Report</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Task</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Setting</div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="content">
          <div className="settings-container">
            
            {/* Section 1: Core Profile */}
            <section className="settings-card">
              <div className="card-header">
                <h3>{userData.role.toUpperCase()} Profile Details</h3>
                <button className="btn-create" onClick={handleSave}>Save Changes</button>
              </div>
              
              <div className="profile-content">
                <div className="avatar-edit">
                  <div
                    className="avatar-large"
                    style={{
                      backgroundImage: `url(${previewImage || 'https://via.placeholder.com/150'})`,
                      backgroundSize: 'cover',
                      border: '3px solid #2563eb'
                    }}
                  >
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

            {/* Section 2: Role Specific Info */}
            <section className="settings-card" style={{ marginTop: '20px' }}>
              <div className="card-header"><h3>Additional Information</h3></div>
              <div className="profile-content">
                
                {/* Nurse Fields */}
                {userData.role === 'nurse' && (
                  <>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div className="form-group"><label>Degree</label><input type="text" name="education.degree" value={userData.education.degree} onChange={handleInputChange} /></div>
                      <div className="form-group"><label>University</label><input type="text" name="education.university" value={userData.education.university} onChange={handleInputChange} /></div>
                      <div className="form-group"><label>License No.</label><input type="text" name="license.number" value={userData.license.number} onChange={handleInputChange} /></div>
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

               {/* --- Relative Specific (NEW ADDED) --- */}
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
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                      
                    </div>
                  </div>
                )}
                {/* --- Elderly Specific --- */}
                {userData.role === 'elderly' && (
                <div className="elderly-info-container">
                    
                    {/* 1. Basic & Address Section - จัดเป็น Grid 2 คอลัมน์มาตรฐาน */}
                    <h4 className="section-title"><i className="fa-solid fa-house-user"></i> Basic & Address</h4>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={userData.dob || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" name="weight" value={userData.weight || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Height (cm)</label>
                        <input type="number" name="height" value={userData.height || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Postal Code</label>
                        <input type="text" name="address.postalCode" value={userData.address?.postalCode || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Street Address</label>
                        <input type="text" name="address.street" value={userData.address?.street || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>District</label>
                        <input type="text" name="address.district" value={userData.address?.district || ""} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label>Province</label>
                        <input type="text" name="address.province" value={userData.address?.province || ""} onChange={handleInputChange} />
                    </div>
                    </div>

                    {/* 2. Medications Section - ย้ายลงมาข้างล่างและใช้พื้นที่เต็มความกว้าง */}
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
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Frequency</label>
                        <select name="medications.0.frequency" value={userData.medications?.[0]?.frequency || ""} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                            <option value="">-- Select --</option>
                            <option value="once daily">Once daily</option>
                            <option value="twice daily">Twice daily</option>
                            <option value="as needed">As needed</option>
                        </select>
                        </div>
                    </div>
                    </div>

                    {/* 3. Disease Allergies Section - ย้ายลงมาล่างสุด */}
                    <h4 className="section-title" style={{ color: '#dc2626' }}><i className="fa-solid fa-hand-dots"></i> Disease Allergies</h4>
                    <div className="allergy-box" style={{ background: '#fef2f2', padding: '20px', borderRadius: '8px' }}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Allergen (สิ่งที่แพ้)</label>
                        <input type="text" name="diseaseAllergies.0.allergen" value={userData.diseaseAllergies?.[0]?.allergen || ""} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                        <label>Reaction</label>
                        <input type="text" name="diseaseAllergies.0.reaction" value={userData.diseaseAllergies?.[0]?.reaction || ""} onChange={handleInputChange} />
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

      {/* --- BOTTOM BAR --- */}
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