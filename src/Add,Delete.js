import React, { useState, useEffect } from 'react';

function AddDelete() {
  // ดึง URL จาก .env หรือใช้ localhost ถ้าไม่ได้ตั้งไว้
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [role, setRole] = useState("nurse");
  const [profiles, setProfiles] = useState([]);
  const [nurses, setNurses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    education: "",
    specialization: "",
    license: "",
    experience: "",
    dateOfBirth: "",
    nationalId: "",
    address: "",
    medicalConditions: "",
    medications: "",
    allergies: "",
    relationship: "",
    relationshipDetail: "",
    emergencyContact: false, // เปลี่ยนเป็น boolean สำหรับ checkbox
    elderlyId: "",
    assignedNurse: "",
  });

  // ฟังก์ชันดึงข้อมูลพยาบาล
  const fetchNurses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/nurses`);
      if (!res.ok) throw new Error(`Fetch nurses failed: ${res.status}`);
      const data = await res.json();
      setNurses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ฟังก์ชันดึงข้อมูลโปรไฟล์ทั้งหมด
  const fetchProfiles = async () => {
    try {
      const [nursesRes, elderlyRes] = await Promise.all([
        fetch(`${API_URL}/api/nurses`),
        fetch(`${API_URL}/api/elderly`)
      ]);

      if (!nursesRes.ok) throw new Error(`Nurses fetch failed: ${nursesRes.status}`);
      if (!elderlyRes.ok) throw new Error(`Elderly fetch failed: ${elderlyRes.status}`);

      const nursesData = await nursesRes.json();
      const elderlyData = await elderlyRes.json();

      setProfiles([...nursesData, ...elderlyData]);
    } catch (err) {
      console.error("fetchProfiles error:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchNurses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const EXTERNAL_URL = process.env.REACT_APP_EXTERNAL_API_URL || null;

  const createUserAPI = async () => {
    let endpoint = "";
    let payload = {};

    if (role === "nurse") {
      endpoint = "/api/users/nurse";
      payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        education: formData.education,
        specialization: formData.specialization,
        skills: [],
        license: formData.license,
        yearsOfExperience: formData.experience,
      };
    } else if (role === "elderly") {
      endpoint = "/api/users/elderly";
      payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        nationalId: formData.nationalId,
        address: formData.address,
        medicalConditions: formData.medicalConditions,
        medications: formData.medications,
        allergies: formData.allergies,
        assignedNurse: formData.assignedNurse,
      };
    } else if (role === "relative") {
      endpoint = "/api/users/relative";
      payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        elderlyId: formData.elderlyId,
        relationship: formData.relationship,
        relationshipDetail: formData.relationshipDetail,
        emergencyContact: formData.emergencyContact,
      };
    } else {
      alert("Unknown role");
      return;
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => null);
        throw new Error(`Create failed: ${res.status} ${errBody || ""}`);
      }

      const data = await res.json();
      alert(data.message || "Created successfully");

      // รีเฟรชข้อมูล
      await fetchProfiles();
      await fetchNurses();

      // forward to external receiver if configured (useful to send to another system/db via its API)
      if (EXTERNAL_URL) {
        try {
          await fetch(EXTERNAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: 'frontend', payload: data }),
          });
        } catch (forwardErr) {
          console.warn('Forward to external URL failed', forwardErr);
        }
      }

      // ล้างฟอร์ม
      setFormData({
        name: "", email: "", phone: "", password: "", education: "",
        specialization: "", license: "", experience: "", dateOfBirth: "",
        nationalId: "", address: "", medicalConditions: "", medications: "",
        allergies: "", relationship: "", relationshipDetail: "",
        emergencyContact: false, elderlyId: "", assignedNurse: ""
      });
    } catch (err) {
      console.error("createUserAPI error:", err);
      alert(err.message || "Create failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Add / Delete Users</h3>
      <div style={{ marginBottom: '20px' }}>
        <label>Select Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="nurse">Nurse</option>
          <option value="elderly">Elderly</option>
          <option value="relative">Relative</option>
        </select>
      </div>

      <p>Current Role: <strong>{role.toUpperCase()}</strong></p>
      
      {/* ตรงนี้คุณสามารถเพิ่มฟิลด์ Input สำหรับ formData ได้เลย */}
      <button onClick={createUserAPI} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>
        Create User
      </button>

      <hr />
      <h4>Profiles Count: {profiles.length}</h4>
    </div>
  );
}

export default AddDelete;