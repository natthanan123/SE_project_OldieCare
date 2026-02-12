import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./Images/logo-oldie.png";
//import { Link } from 'react-router-dom';
import './Component.css'; // ไฟล์ CSS หลัก (Topbar, Sidebar, Bottombar)

const API_URL = "https://se-project-oldiecare.onrender.com";
const AdminTaskMain = () => {
const navigate = useNavigate();

const [tasks, setTasks] = useState([]);
const [nurses, setNurses] = useState([]);
const [loading, setLoading] = useState(false);

const [elderlies, setElderlies] = useState([]);
const [selectedElderly, setSelectedElderly] = useState(null);
const [showModal, setShowModal] = useState(false);

const [loadingElderly, setLoadingElderly] = useState(false);

const MAX_PATIENT = 3;


const fetchElderlies = async () => {
  try {
    setLoadingElderly(true);
    const res = await fetch(`${API_URL}/api/users/elderly`);
    const data = await res.json();
    setElderlies(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingElderly(false);
  }
};

useEffect(() => {
  fetchElderlies();
}, []);



const openAssignModal = async (elderly) => {
  setSelectedElderly(elderly);
  setShowModal(true);

  // โหลด nurse ตอนเปิด
  loadNurses();
};




const sortedNurses = [...nurses].sort((a, b) =>
  
  (a.userId?.name || "").localeCompare(b.userId?.name || "")
);


const loadNurses = async () => {
  try {
    const res = await fetch(`${API_URL}/api/recommend-nurses`);

    if (!res.ok) throw new Error("load nurse failed");

    const nursesData = await res.json();

    console.log("NURSE DATA =", nursesData);

    setNurses(nursesData);
  } catch (err) {
    console.error(err);
  }
};



const assignNurse = async (elderlyId, nurseId) => {
  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/api/elderly/assign-nurse`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elderlyId, nurseId }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Assign failed");

    alert("Assigned success");

    loadNurses();      // โหลด nurse ใหม่
    fetchElderlies();  // โหลด elderly ใหม่ให้เห็นผลทันที
    setShowModal(false);

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>
      
      {/* --- Top Bar --- */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
             <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Tasks</div>
        </div>

        <div className="topbar-right">
          <div className="noti-box"><i className="fa-solid fa-bell"></i></div>
          <div className="profile-img" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=admin')`, backgroundSize: 'cover' }}></div>
          <div className="profile-info">
            <div className="name">Admin User</div>
            <div className="role">Administrator</div>
          </div>
        </div>
      </div>

      {/* --- Body Container --- */}
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard
          </div>
          
          <div
            className="menu-item"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <span className="menu-icon">
              <i className="fa-solid fa-people-group"></i>
            </span>
            Users
          </div>

          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-file-lines"></i></span> Reports
          </div>
          <div className="menu-item active">
            <span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Tasks
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Settings
          </div>
        </div>

        {/* 3. Task Table Card */}
      <div
        className="table-card shadow-sm"
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <div style={{ position: "relative" }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                color: "#999",
              }}
            ></i>
            <input
              type="text"
              placeholder="Search tasks, elderly..."
              style={{
                padding: "8px 10px 8px 35px",
                borderRadius: "8px",
                border: "1px solid #eee",
                width: "300px",
              }}
            />
          </div>
        </div>
          
          {/* 3. Task Table Card */}
          <div className="table-card shadow-sm" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
               <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }}></i>
                  <input type="text" placeholder="Search tasks, elderly..." style={{ padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #eee', width: '300px' }} />
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                 
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>

            </div>

          <div className="table-card">

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Elderly</th>
                  <th>Current Nurse</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
              {loadingElderly ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                    Loading...
                  </td>
                </tr>
              ) : elderlies.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                    No elderly
                  </td>
                </tr>
              ) : (
                elderlies.map((e) => (
                  <tr key={e._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    
                    {/* Elderly */}
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                          src={e.userId?.profileImage || "https://i.pravatar.cc/100"}
                          alt=""
                          style={{ width: 36, height: 36, borderRadius: "50%" }}
                        />

                        <span style={{ fontWeight: 600 }}>
                          {e.userId?.name}
                        </span>
                      </div>
                    </td>


                    {/* Current Nurse */}
                    <td style={{ padding: 12 }}>
                      {e.assignedNurse ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <img
                            src={
                              e.assignedNurse?.userId?.profileImage ||
                              "https://i.pravatar.cc/100"
                            }
                            alt=""
                            style={{ width: 30, height: 30, borderRadius: "50%" }}
                          />
                          <span>{e.assignedNurse?.userId?.name}</span>
                        </div>
                      ) : (
                        <span style={{ color: "#999" }}>Not assigned</span>
                      )}
                    </td>

                    {/* Assign */}
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        className="btn-edit-icon"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          openAssignModal(e);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          cursor: "pointer",
                          fontSize: "18px",
                          padding: "5px",
                        }}
                        title="Assign nurse"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>



          {/* Popup */}
{showModal && (
  <div
    className="modal-overlay"
    onClick={() => setShowModal(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(2px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    {/* กล่อง */}
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 420,
        maxHeight: "80vh",
        overflowY: "auto",
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <h3 style={{ margin: 0 }}>
          Assign nurse for{" "}
          {selectedElderly?.userId?.name || "Unknown"}
        </h3>

        <button
          onClick={() => setShowModal(false)}
          style={{
            border: "none",
            background: "none",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

     {/* List */}
{nurses?.length === 0 ? (
  <div style={{ textAlign: "center", padding: 20, color: "#888" }}>
    No nurses available
  </div>
) : (
  nurses
    .sort((a, b) => (a.patientCount || 0) - (b.patientCount || 0))
    .map((n) => (
      <div
        key={n.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <img
            src={n.profileImage || "https://i.pravatar.cc/100"}
            alt=""
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />

          <div>
            <div style={{ fontWeight: 600 }}>
              {n.name || "No Name"}
            </div>

            <div style={{ fontSize: 12, color: "#777" }}>
              {n.patientCount || 0} / {MAX_PATIENT} patients
            </div>
          </div>
        </div>

        <button
          disabled={(n.patientCount || 0) >= MAX_PATIENT}
          onClick={() => assignNurse(selectedElderly._id, n.id)}
          style={{
            background: (n.patientCount || 0) >= MAX_PATIENT ? "#ddd" : "#2563eb",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            cursor: (n.patientCount || 0) >= MAX_PATIENT ? "not-allowed" : "pointer",
          }}
        >
          {(n.patientCount || 0) >= MAX_PATIENT ? "Full" : "Assign"}
        </button>
      </div>
    ))
)}

    </div>
  </div>
)}




            <div className="table-responsive">
              <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '15px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div className={`icon-box-bg`} style={{ width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f7ff', color: '#4A90E2' }}>
                              <i className={`fa-solid ${task.id % 2 === 0 ? "fa-utensils" : "fa-pills"}`}></i>
                           </div>
                           <div>
                             <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{task.name}</p>
                             <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{task.sub}</p>
                           </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={task.elderlyImg} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                          <div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{task.elderly}</p>
                            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Room {task.room}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <p style={{ margin: 0, fontSize: '14px' }}>{task.caregiver}</p>
                        <p style={{ fontSize: '11px', color: '#4A90E2', margin: 0 }}>{task.role}</p>
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{task.time}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-tag st-${task.color}`} style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                          <i className={`fa-solid ${task.icon}`} style={{ marginRight: '5px' }}></i> {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                         <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                           <i title="View" className="fa-regular fa-eye" style={{ cursor: 'pointer', color: '#4A90E2' }}></i>
                           <i title="Approve" className="fa-solid fa-circle-check" style={{ cursor: 'pointer', color: '#22c55e' }}></i>
                           <i title="Edit" className="fa-regular fa-pen-to-square" style={{ cursor: 'pointer', color: '#999' }}></i>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder (ตามภาพ image_4181f7.png) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
               <div>Showing 1 to 5 of 44 tasks</div>
               <div style={{ display: 'flex', gap: '5px' }}>
                  <button style={{ padding: '5px 10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: 'white' }}><i className="fa-solid fa-chevron-left"></i></button>
                  <button style={{ padding: '5px 10px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '4px' }}>1</button>
                  <button style={{ padding: '5px 10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: 'white' }}>2</button>
                  <button style={{ padding: '5px 10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: 'white' }}><i className="fa-solid fa-chevron-right"></i></button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="bottombar">
        <div className="bottom-item">
          <i className="fa-solid fa-chart-line"></i>
          <div>Dashboard</div>
        </div>
        <div className="bottom-item">
          <i className="fa-solid fa-people-group"></i>
          <div>User</div>
        </div>
        <div className="bottom-item">
          <i className="fa-solid fa-chart-bar"></i>
          <div>Report</div>
        </div>
        <div className="bottom-item active">
          <i className="fa-solid fa-tasks"></i>
          <div>Task</div>
        </div>
        <div className="bottom-item">
          <i className="fa-solid fa-cog"></i>
          <div>Setting</div>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskMain;