import React from 'react';
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

const AdminReportsEstimateDetail = () => {
  // ข้อมูลตัวอย่างสำหรับตาราง Work Log Records (อ้างอิงจาก image_37849a.png)
  const logRecords = [
    { date: 'Jan 18, 2026', time: '08:00 - 10:30', elderly: 'Margaret Smith', type: 'Normal', desc: 'Morning medication, vital signs check', status: 'Completed' },
    { date: 'Jan 18, 2026', time: '11:15 - 12:00', elderly: 'Robert Johnson', type: 'Emergency', desc: 'Sudden chest pain, BP monitoring', status: 'Completed' },
    { date: 'Jan 18, 2026', time: '14:00 - 15:30', elderly: 'Dorothy Williams', type: 'Normal', desc: 'Physical therapy assistance, mobility exercise', status: 'Completed' },
    { date: 'Jan 17, 2026', time: '09:00 - 11:00', elderly: 'James Anderson', type: 'Normal', desc: 'Wound dressing change, diabetes monitoring', status: 'Completed' },
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
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Amin Reports</div>
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

      <div className="container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> Users</div>
          <div className="menu-item active"><span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Reports</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Tasks</div>
          <div className="menu-item"><span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Settings</div>
        </div>

        {/* --- Main Content --- */}
        <div className="content" style={{ backgroundColor: '#f4f7fe' }}>
          
          {/* Back Button & Header */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
             <i className="fa-solid fa-arrow-left" style={{ cursor: 'pointer', color: '#6366f1', fontSize: '20px' }}></i>
          </div>

          {/* 1. Filter Section (image_37849a.png) */}
          <div className="big-card" style={{ marginBottom: '20px', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 150px', gap: '15px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Staff Member</label>
                <select className="search-input" style={{ width: '100%' }}><option>Tara (Nurse)</option></select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Date Range</label>
                <select className="search-input" style={{ width: '100%' }}><option>Last 7 Days</option></select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Work Type</label>
                <select className="search-input" style={{ width: '100%' }}><option>All Types</option></select>
              </div>
              <button style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                <i className="fa-solid fa-filter"></i> Apply Filters
              </button>
            </div>
          </div>

          {/* 2. Staff Profile & Summary Chart Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Staff Card */}
            <div className="big-card" style={{ padding: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundImage: `url('https://i.pravatar.cc/150?u=tara')`, backgroundSize: 'cover' }}></div>
                <div>
                  <h3 style={{ margin: 0 }}>Tara</h3>
                  <div style={{ color: '#6366f1', fontSize: '14px', fontWeight: '500' }}>Registered Nurse</div>
                  <div style={{ fontSize: '12px', color: '#22c55e' }}>● Active <span style={{ color: '#999', marginLeft: '10px' }}>ID: NS-2847</span></div>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#eff6ff', color: '#3b82f6', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-users"></i></div>
                  <div><div style={{ fontSize: '11px', color: '#999' }}>Assigned Elderly</div><div style={{ fontWeight: 'bold' }}>24</div></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#f5f3ff', color: '#8b5cf6', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-clock"></i></div>
                  <div><div style={{ fontSize: '11px', color: '#999' }}>Total Hours (7 days)</div><div style={{ fontWeight: 'bold' }}>42.5 hrs</div></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#fef2f2', color: '#ef4444', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-triangle-exclamation"></i></div>
                  <div><div style={{ fontSize: '11px', color: '#999' }}>Emergency Cases</div><div style={{ fontWeight: 'bold' }}>3</div></div>
                </div>
              </div>
            </div>

            {/* Work Hours Summary Chart Area */}
            <div className="big-card">
              <h4 style={{ margin: '0 0 15px 0' }}>Work Hours Summary</h4>
              <div style={{ width: '100%', height: '220px', background: '#fff', border: '1px dashed #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                 [ Bar Chart: Daily Work Hours Visualization ]
              </div>
            </div>
          </div>

          {/* 3. Work Log Records Table */}
          <div className="big-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Work Log Records</h3>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '10px', color: '#ccc' }}></i>
                <input type="text" placeholder="Search tasks..." className="search-input" style={{ paddingLeft: '35px', width: '250px' }} />
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#888', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                  <th style={{ padding: '15px' }}>Date</th>
                  <th style={{ padding: '15px' }}>Time</th>
                  <th style={{ padding: '15px' }}>Elderly Name</th>
                  <th style={{ padding: '15px' }}>Task Type</th>
                  <th style={{ padding: '15px' }}>Task Description</th>
                  <th style={{ padding: '15px' }}>Status</th>
                  <th style={{ padding: '15px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {logRecords.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9', backgroundColor: item.type === 'Emergency' ? '#fff5f5' : 'transparent' }}>
                    <td style={{ padding: '15px', fontSize: '13px' }}>{item.date}</td>
                    <td style={{ padding: '15px', fontSize: '13px' }}>{item.time}</td>
                    <td style={{ padding: '15px', fontSize: '13px', fontWeight: '500' }}>{item.elderly}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ fontSize: '11px', color: item.type === 'Emergency' ? '#ef4444' : '#22c55e', fontWeight: '600' }}>
                        {item.type === 'Emergency' && <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '5px' }}></i>}
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '13px', color: '#666' }}>{item.desc}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ color: '#22c55e', fontSize: '12px' }}>{item.status}</span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Placeholder */}
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
        <div className="bottom-item"><i className="fa-solid fa-chart-line"></i><div>Dashboard</div></div>
        <div className="bottom-item"><i className="fa-solid fa-people-group"></i><div>User</div></div>
        <div className="bottom-item active"><i className="fa-solid fa-chart-bar"></i><div>Report</div></div>
        <div className="bottom-item"><i className="fa-solid fa-tasks"></i><div>Task</div></div>
        <div className="bottom-item"><i className="fa-solid fa-cog"></i><div>Setting</div></div>
      </div>
    </div>
  );
};

export default AdminReportsEstimateDetail;