import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./Images/logo-oldie.png";
import './Component.css'; // ตรวจสอบชื่อไฟล์และ Path ของ CSS ให้ถูกต้อง


const Dashboard = () => {
  return (
    
    <div className="dashboard-container">
     <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
             <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div>Admin Dashboard</div>
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
          <div className="menu-item active">
            <span className="menu-icon">
              <i className="fa-solid fa-chart-line"></i>
            </span>{" "}
            Dashboard
          </div>
          <div className="menu-item">
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
          <div className="cards">
            <div className="card">
              <div className="card-header">
                <div className="icon-box blue">
                  <i className="fa-solid fa-user-group"></i>
                </div>
                <div className="status" style={{ color: "green" }}>
                  Normal
                </div>
              </div>
              <div className="title">Total Elderly</div>
              <div className="number">247</div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="icon-box purple">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <div className="status" style={{ color: "green" }}>
                  Normal
                </div>
              </div>
              <div className="title">Caregivers</div>
              <div className="number">89</div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="icon-box yellow">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <div className="status" style={{ color: "orange" }}>
                  Warning
                </div>
              </div>
              <div className="title">Active Tasks</div>
              <div className="number">156</div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="icon-box red">
                  <i className="fa-solid fa-bell"></i>
                </div>
                <div className="status" style={{ color: "red" }}>
                  SOS
                </div>
              </div>
              <div className="title">SOS Alerts</div>
              <div className="number">3</div>
            </div>
          </div>

          <div className="two-cards">
            <div className="big-card">
              <div className="big-card-header">
                <div className="big-card-title">User Manager</div>
                <i className="fa-solid fa-people-group"></i>
              </div>
              <div className="big-card-content">Content for User Manager</div>
            </div>

            <div className="big-card">
              <div className="big-card-header">
                <div className="big-card-title">Report Overview</div>
                <i className="fa-solid fa-chart-bar"></i>
              </div>
              <div className="big-card-content">Content for Report Overview</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottombar">
        <div className="bottom-item active">
          <div>
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div>Dashboard</div>
        </div>
        <div className="bottom-item">
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

export default Dashboard;