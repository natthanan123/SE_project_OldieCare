import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

const API_URL = "https://se-project-oldiecare.onrender.com/";
const EXTERNAL_URL = process.env.REACT_APP_EXTERNAL_API_URL || null;

const AdminUserMain = () => {
const navigate = useNavigate();



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles, setProfiles] = useState([]); 
  const [error, setError] = useState("");
  
  const initialFormState = {
    // Common Fields
    name: "", email: "", phone: "", role: "", password: "",
    
    // Nurse Specific
    education: { degree: "", major: "", university: "", graduationYear: "" },
    specialization: "", 
    license: { number: "", expiryDate: "" },
    educationDocuments: [], // Array ของ {documentUrl, documentType}
    licenseDocuments: [],   // Array ของ {documentUrl, licenseType}
    experience: 0, checkIn: "", checkOut: "",

    // Relative Specific
    relationship: "child", relationshipDetail: "", emergencyContact: false,

    // Elderly Specific
    dob: "", weight: "", height: "", 
    address: { street: "", district: "", province: "", postalCode: "" }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [previewImage, setPreviewImage] = useState(null); // รูป Avatar หลัก
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerms, setSearchTerms] = useState({ nurse: "", relative: "", elderly: "" });

// ================= API =================
const fetchUsers = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProfiles(data);
  } catch (err) {
    console.error("Fetch users failed", err);
  }
};

const createUserAPI = async (userData) => {
  console.log('createUserAPI request payload:', userData);

  const res = await fetch("https://se-project-oldiecare.onrender.com/api/users/nurse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  console.log('createUserAPI response:', data);
  if (!res.ok) {
    console.error('createUserAPI error:', res.status, data);
    throw new Error("Create failed");
  }
  return data;
};

const deleteUserAPI = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

useEffect(() => {
  fetchUsers();
}, []);

  // จัดการรูป Profile หลัก
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  // --- [NEW] จัดการรูปภาพหลายใบ (Docs & Licenses) ---
  const handleMultipleImages = (e, field) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      documentUrl: URL.createObjectURL(file),
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
    setFormData({ ...initialFormState, role: selectedRole });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in required fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        image: previewImage,
        createdAt: new Date(),
      };

      const savedUser = await createUserAPI(payload);

      setProfiles([...profiles, savedUser]);
      setIsModalOpen(false);
      setError("");

      // forward to external receiver if configured (useful to send to another system/db via its API)
      if (EXTERNAL_URL) {
        try {
          await fetch(EXTERNAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'frontend', payload: savedUser }),
          });
        } catch (forwardErr) {
          console.warn('Forward to external URL failed', forwardErr);
        }
      }
    } catch (err) {
      setError("Create user failed");
    }
  };

  const handleOpenDeleteModal = (e, user) => {
    e.stopPropagation(); 
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserAPI(userToDelete.id);

      setProfiles(profiles.filter(p => p.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSearchChange = (role, value) => {
    setSearchTerms(prev => ({ ...prev, [role]: value }));
  };

  // --- [NEW] Create Nurse function (for testing) ---
  const createNurse = async () => {
    try {
      const response = await fetch('https://se-project-oldiecare.onrender.com/api/users/nurse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Akeaswin",
          email: "akeaswin@example.com",
          phone: "0912345678",
          password: "password123",
          education: "Bachelor",
          specialization: "Geriatric Nursing",
          skills: ["Patient Care", "Medical Administration"],
          license: "LN123456",
          yearsOfExperience: 5
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- [NEW] Create Relative function (for testing) ---
  const createRelative = async () => {
    try {
      const response = await fetch('https://se-project-oldiecare.onrender.com/api/users/relative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Akeaswin",
          email: "akeaswin.relative@example.com",
          phone: "0987654321",
          password: "password123",
          elderlyId: "elderly_id_here",
          relationship: "child",
          relationshipDetail: "Son",
          emergencyContact: true
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- [NEW] Create Elderly function (for testing) ---
  const createElderly = async () => {
    try {
      const response = await fetch('https://se-project-oldiecare.onrender.com/api/users/elderly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: "Akeaswin",
          email: "akeaswin.elderly@example.com",
          phone: "0856789012",
          password: "password123",
          dob: "1945-01-15",
          weight: 65,
          height: 170,
          bloodType: "O+",
          allergies: ["Penicillin"],
          address: {
            street: "123 Main St",
            district: "Watthana",
            province: "Bangkok",
            postalCode: "10110"
          }
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getNurseById = async (nurseId) => {
    try {
      const response = await fetch(`https://se-project-oldiecare.onrender.com/api/nurses/${nurseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
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
          <div className="menu-item">
            <span className="menu-icon">
              <i className="fa-solid fa-tasks"></i>
            </span>{" "}
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
            ].map((card) => (
              <div className="user-card" key={card.role}>
                <div className="user-card-header">
                  <h3>{card.title}</h3>
                  <button className="btn plus" onClick={() => openModalWithRole(card.role)}>+</button>
                </div>
                <div className="created-profiles-list">
                  {profiles
                    .filter(p => p.role === card.role)
                    .filter(p => p.name.toLowerCase().includes(searchTerms[card.role].toLowerCase()))
                    .map((user) => (
                      <div key={user.id} className="user-profile-row" onClick={() => navigate(`/user/profile/${user.id}`, { state: user })}>
                        <div className="mini-avatar" style={{ backgroundImage: `url(${user.image })`, backgroundSize: 'cover' }}></div>
                        <div className="user-info-text">
                           <span className="u-name">{user.name}</span>
                           <span className="u-role">{card.role}</span>
                        </div>
                        <button className="btn-delete-item" onClick={(e) => handleOpenDeleteModal(e, user)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ff4d4d' }}>
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
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
                    <div className="form-group"><label>Degree</label><input type="text" name="education.degree" placeholder="e.g. Bachelor" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Major</label><input type="text" name="education.major" placeholder="Nursing Science" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>University</label><input type="text" name="education.university" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Graduation Year</label><input type="number" name="education.graduationYear" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>License Number</label><input type="text" name="license.number" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>License Expiry</label><input type="date" name="license.expiryDate" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Check-In</label><input type="time" name="checkIn" onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Check-Out</label><input type="time" name="checkOut" onChange={handleInputChange} /></div>
                  </div>

                  {/* Multiple Degree Documents */}
                  <div className="form-group" style={{ marginTop: '15px' }}>
                    <label>Education Documents (Degree/Diploma)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {formData.educationDocuments.map((img, idx) => (
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
                      {formData.licenseDocuments.map((img, idx) => (
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
                  <div className="form-group">
                    <label>Relationship</label>
                    <select name="relationship" value={formData.relationship} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                      <option value="child">Child (ลูก)</option>
                      <option value="spouse">Spouse (คู่สมรส)</option>
                      <option value="sibling">Sibling (พี่น้อง)</option>
                      <option value="sibling">Parent (ผู้ปกครอง)</option>
                      <option value="grandchild">Grandchild (หลาน)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {formData.relationship === 'other' && (
                    <div className="form-group"><label>Detail</label><input type="text" name="relationshipDetail" onChange={handleInputChange} /></div>
                  )}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    
                    
                  </div>
                </div>
              )}

              {/* --- Elderly Specific --- */}
              {formData.role === 'elderly' && (
                <>
                  <h4 className="section-title"><i className="fa-solid fa-house-user"></i> Basic & Address</h4>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Weight (kg)</label><input type="number" name="weight" value={formData.weight} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Postal Code</label><input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleInputChange} /></div>
                    
                    <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Street Address</label><input type="text" name="address.street" placeholder="Building, Soi, etc." value={formData.address.street} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>District</label><input type="text" name="address.district" value={formData.address.district} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Province</label><input type="text" name="address.province" value={formData.address.province} onChange={handleInputChange} /></div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Assigned Nurse</label>
                      <select name="assignedNurse" value={formData.assignedNurse} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="">-- Select Nurse --</option>
                        {profiles.filter(p => p.role === 'nurse').map(nurse => (
                          <option key={nurse.id} value={nurse.id}>{nurse.name}</option>
                        ))}
                      </select>
                    </div>
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