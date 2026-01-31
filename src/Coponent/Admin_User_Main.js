import React from 'react';
import logoImg from "./Images/logo-oldie.png";
//import { Link } from 'react-router-dom'; // นำเข้า Link เพื่อใช้แทน <a href>
import './Component.css';

const AdminUserMain = () => {
  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
             <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div>Admin User</div>
        </div>

        <div className="topbar-right">
          <div className="noti-box">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className="profile-img"></div>
          <div className="profile-info">
            <div className="name">Admin Name</div>
            <div className="role">Administrator</div>
          </div>
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

        {/* Main Content */}
        <div className="content">
          <div className="user-boxes">
            {/* Nurse User Card */}
            <div className="user-card">
              <div className="user-card-header">
                <h3>Nurse User</h3>
                <div className="actions">
                  <button className="btn plus">+</button>
                  <button className="btn minus">-</button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search Nurse..."
                className="search-input"
              />
            </div>

            {/* Kin User Card */}
            <div className="user-card">
              <div className="user-card-header">
                <h3>Kin User</h3>
                <div className="actions">
                  <button className="btn plus">+</button>
                  <button className="btn minus">-</button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search Kin..."
                className="search-input"
              />
            </div>

            {/* Older User Card */}
            <div className="user-card">
              <div className="user-card-header">
                <h3>Older User</h3>
                <div className="actions">
                  <button className="btn plus">+</button>
                  <button className="btn minus">-</button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search Older..."
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottombar">
        <div className="bottom-item">
          <div>
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div>Dashboard</div>
        </div>
        <div className="bottom-item active">
          <div>
            <i className="fa-solid fa-people-group"></i>
          </div>
          <div>User</div>
        </div>
        <div className="bottom-item">
          <div>
            <i className="fa-solid fa-chart-bar"></i>
          </div>
          <div>Report</div>
        </div>
        <div className="bottom-item">
          <div>
            <i className="fa-solid fa-tasks"></i>
          </div>
          <div>Task</div>
        </div>
        <div className="bottom-item">
          <div>
            <i className="fa-solid fa-cog"></i>
          </div>
          <div>Setting</div>
        </div>
      </div>

      {/* Chat Floating Button - เปลี่ยนเป็น Link ไปหน้า /chat */}
      <Link to="/chat" className="chat-widget" style={{ textDecoration: 'none' }}>
        <div className="chat-icon">
          <i className="fa-solid fa-comment-dots"></i>
        </div>
        <div className="chat-text">Messages</div>
      </Link>
    </div>
  );
};

export default AdminUserMain;