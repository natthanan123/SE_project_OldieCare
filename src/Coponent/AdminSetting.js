import React from 'react';
import logoImg from "./Images/logo-oldie.png";
import './Component.css'; // ใช้ CSS หลักสำหรับ Layout

const AdminSetting = () => {
  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>

      {/* --- Top Bar (โครงสร้างจาก Component.css) --- */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
             <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div>Admin Settings</div>
        </div>

        <div className="topbar-right">
          <div className="noti-box">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className="profile-img" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=john')`, backgroundSize: 'cover' }}></div>
          <div className="profile-info">
            <div className="name">John Administrator</div>
            <div className="role">Super Administrator</div>
          </div>
        </div>
      </div>

      {/* --- Body Container --- */}
      <div className="container">
        {/* Sidebar (โครงสร้างจาก Component.css) */}
        <div className="sidebar">
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> User
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Report
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Task
          </div>
          <div className="menu-item active">
            <span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Setting
          </div>
        </div>

        {/* --- Main Content (เนื้อหาจากหน้า Setting เดิม) --- */}
        <div className="content">
          <div className="settings-container">
            {/* 1. Admin Profile Card */}
            <section className="settings-card">
              <div className="card-header">
                <h3>Admin Profile</h3>
                <button className="btn-text-blue">Edit Profile</button>
              </div>
              <div className="profile-content">
                <div className="avatar-edit">
                  <div
                    className="avatar-large"
                    style={{
                      backgroundImage: `url('https://i.pravatar.cc/150?u=john')`,
                    }}
                  >
                    <div className="camera-icon">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="John Administrator" className="search-input" />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="john.admin@company.com" className="search-input" />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="text" defaultValue="+1 (555) 123-4567" className="search-input" />
                  </div>
                  <div className="input-group">
                    <label>Role</label>
                    <select className="search-input">
                      <option>Super Administrator</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Change Password Card */}
            <section className="settings-card">
              <h3>Change Password</h3>
              <div className="form-single">
                <div className="input-group">
                  <label>Current Password</label>
                  <div className="password-wrapper">
                    <input type="password" placeholder="••••••••" className="search-input" />
                    <i className="fa-regular fa-eye"></i>
                  </div>
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="password-wrapper">
                    <input type="password" placeholder="••••••••" className="search-input" />
                    <i className="fa-regular fa-eye"></i>
                  </div>
                </div>
                <button className="btn-primary-wide" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                  Update Password
                </button>
              </div>
            </section>

            {/* 3. Security & Session */}
            <section className="settings-card no-border">
              <h3>Security & Session</h3>
              <div className="info-box yellow" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div className="icon-box yellow">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Two-Factor Authentication</p>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Add an extra layer of security</p>
                </div>
                <button className="btn plus" style={{ width: 'auto', padding: '0 15px' }}>Enable</button>
              </div>

              <div className="info-box red" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '12px' }}>
                <div className="icon-box red">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Logout from Account</p>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Sign out of your session</p>
                </div>
                <button className="btn minus" style={{ width: 'auto', padding: '0 15px' }}>Logout</button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar (สำหรับ Mobile) --- */}
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
        <div className="bottom-item">
          <i className="fa-solid fa-tasks"></i>
          <div>Task</div>
        </div>
        <div className="bottom-item active">
          <i className="fa-solid fa-cog"></i>
          <div>Setting</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetting;