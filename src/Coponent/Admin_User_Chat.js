import React from 'react';
import logoImg from "./Images/logo-oldie.png";
import './Component.css'; // ตรวจสอบว่าชื่อไฟล์ CSS ถูกต้อง

const AdminUserChat = () => {
  return (
    <div className="admin-chat-wrapper">
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

        {/* Main Content (Chat Layout) */}
        <div className="content">
          <div className="message-layout">
            {/* Block Message (Sidebar ย่อยฝั่งซ้ายของแชท) */}
            <div className="message-block">
              {/* Header */}
              <div className="message-header">
                <i className="fa-solid fa-arrow-left" style={{ cursor: 'pointer' }}></i>
                <span>Messages</span>
              </div>

              {/* Search */}
              <div className="message-search">
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="search-input" // ใช้ Class จาก CSS ที่คุณมี
                />
              </div>

              {/* Tabs */}
              <div className="message-tabs">
                <button className="tab active">All</button>
                <button className="tab">Nurse</button>
                <button className="tab">Relatives</button>
              </div>

              {/* Message List */}
              <div className="message-list">
                <div className="message-item">Nurse A</div>
                <div className="message-item">Relative B</div>
                <div className="message-item">Older User C</div>
              </div>
            </div>

            {/* Chat Area (ฝั่งขวาที่แสดงข้อความ) */}
            <div className="chat-area">
              <div className="chat-header">Chat</div>
              <div className="chat-content">
                Select a user to start chatting...
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Mobile Navigation) */}
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
    </div>
  );
};

export default AdminUserChat;