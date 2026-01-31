import React from 'react';
import logoImg from "./Images/logo-oldie.png";
//import { Link } from 'react-router-dom';
import './Component.css'; // ไฟล์ CSS หลัก (Topbar, Sidebar, Bottombar)


const AdminTaskMain = () => {
  // ข้อมูล Task (อ้างอิงจากรายการงานในระบบดูแลผู้สูงอายุ)
  const tasks = [
    { id: 1, name: "Morning Medication", sub: "Blood pressure pills", elderly: "Eleanor Smith", room: "101", caregiver: "Marcus Chen", role: "Nurse", time: "Jan 20, 2024 8:00 AM", status: "Pending", icon: "fa-clock", color: "orange", elderlyImg: "https://i.pravatar.cc/150?u=e1" },
    { id: 2, name: "Breakfast Assistance", sub: "Help with eating", elderly: "Robert Davis", room: "205", caregiver: "Lisa Rodriguez", role: "Aide", time: "Jan 20, 2024 7:30 AM", status: "Completed", icon: "fa-check", color: "green", elderlyImg: "https://i.pravatar.cc/150?u=e2" },
    { id: 3, name: "Personal Hygiene", sub: "Morning wash", elderly: "Margaret Wilson", room: "103", caregiver: "James Thompson", role: "Aide", time: "Jan 20, 2024 9:00 AM", status: "In Progress", icon: "fa-play", color: "blue", elderlyImg: "https://i.pravatar.cc/150?u=e3" },
    { id: 4, name: "Vitals Check", sub: "Blood pressure & temperature", elderly: "William Brown", room: "208", caregiver: "Marcus Chen", role: "Nurse", time: "Jan 20, 2024 10:00 AM", status: "Pending", icon: "fa-clock", color: "orange", elderlyImg: "https://i.pravatar.cc/150?u=e4" },
    { id: 5, name: "Physical Therapy", sub: "Leg exercises", elderly: "Eleanor Smith", room: "101", caregiver: "David Miller", role: "Therapist", time: "Jan 20, 2024 2:00 PM", status: "Scheduled", icon: "fa-calendar", color: "brown", elderlyImg: "https://i.pravatar.cc/150?u=e1" },
  ];

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
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> Users
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

        {/* --- Main Content --- */}
        <div className="content" style={{ backgroundColor: '#f8f9fa' }}>
          
          {/* 1. Task Summary Cards (เพิ่มมาเพื่อให้ดูเป็นระบบ Dashboard) */}
         

          {/* 2. Page Header: Tabs & Create Button */}
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <div className="status-tabs">
              <button className="tab active">Today <span>12</span></button>
              <button className="tab">Pending <span>8</span></button>
              <button className="tab">Completed <span>24</span></button>
            </div>
            <button className="btn-create" style={{ padding: '10px 20px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fa-solid fa-plus"></i> Create Task
            </button>
          </div>

          {/* 3. Task Table Card */}
          <div className="table-card shadow-sm" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
               <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '10px', color: '#999' }}></i>
                  <input type="text" placeholder="Search tasks, elderly..." style={{ padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #eee', width: '300px' }} />
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee' }}>
                     <option>All Caregivers</option>
                  </select>
               </div>
            </div>

            <div className="table-responsive">
              <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', color: '#888', fontSize: '14px' }}>
                    <th style={{ padding: '12px' }}>Task Name</th>
                    <th style={{ padding: '12px' }}>Elderly</th>
                    <th style={{ padding: '12px' }}>Caregiver</th>
                    <th style={{ padding: '12px' }}>Scheduled Date</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
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