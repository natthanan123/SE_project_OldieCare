import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logoImg from "./Images/logo-oldie.png";
import './Component.css';

const AdminReportsEstimate = () => {
  // ข้อมูลตัวอย่างสำหรับตารางรายชื่อบุคลากร
  const staffData = [
    { id: 'NUR-001', name: 'พญ. สุดารัตน์ วงศ์ใหญ่', role: 'พยาบาลวิชาชีพ', score: 4.9, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'CAR-012', name: 'นายสมชาย ใจดี', role: 'ผู้ดูแลผู้สูงอายุ', score: 4.7, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'PHY-008', name: 'นางสาววิภา ศรีสุข', role: 'นักกายภาพบำบัด', score: 4.8, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 'CAR-015', name: 'นายประสิทธิ์ มั่นคง', role: 'ผู้ดูแลผู้สูงอายุ', score: 4.5, avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 'NUR-005', name: 'นางสาวมาลี สุขสันต์', role: 'พยาบาลวิชาชีพ', score: 4.6, avatar: 'https://i.pravatar.cc/150?u=5' },
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
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Admin Dashboard</div>
        </div>

        <div className="topbar-right">
          <div className="noti-box">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className="profile-img" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=admin')`, backgroundSize: 'cover' }}></div>
          <div className="profile-info">
            <div className="name">Admin User</div>
            <div className="role">Administrator</div>
          </div>
        </div>
      </div>

      {/* --- Body Container --- */}
      <div className="container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-chart-line"></i></span> Dashboard
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-people-group"></i></span> User
          </div>
          <div className="menu-item  active">
            <span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Report
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Task
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Setting
          </div>
        </div>

        {/* --- Main Content (อ้างอิงจากรูปภาพประเมินบุคลากร) --- */}
        <div className="content" style={{ backgroundColor: '#f4f7fe' }}>
          
          {/* 1. Top Summary Cards */}
          <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="icon-box blue" style={{ borderRadius: '50%' }}><i className="fa-solid fa-users"></i></div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>จำนวนบุคลากรทั้งหมด</div>
               </div>
               <div className="number" style={{ fontSize: '32px', marginTop: '10px' }}>48</div>
            </div>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="icon-box green" style={{ borderRadius: '50%' }}><i className="fa-solid fa-star"></i></div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>คะแนนเฉลี่ยรวม</div>
               </div>
               <div className="number" style={{ fontSize: '32px', marginTop: '10px' }}>4.6 <span style={{ fontSize: '14px', color: '#ccc' }}>/ 5.0</span></div>
            </div>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="icon-box purple" style={{ borderRadius: '50%' }}><i className="fa-solid fa-comment-dots"></i></div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>ความคิดเห็นทั้งหมด</div>
               </div>
               <div className="number" style={{ fontSize: '32px', marginTop: '10px' }}>342</div>
            </div>
            <div className="card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="icon-box yellow" style={{ borderRadius: '50%' }}><i className="fa-solid fa-trophy"></i></div>
                  <div style={{ fontSize: '12px', color: 'gray' }}>หน่วยงานดีเด่น</div>
               </div>
               <div className="number" style={{ fontSize: '32px', marginTop: '10px' }}>12</div>
            </div>
          </div>

          {/* 2. Charts Section Placeholder */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div className="big-card" style={{ minHeight: '250px' }}>
              <h4 style={{ marginBottom: '15px' }}>การกระจายคะแนนประเมิน</h4>
              <div style={{ width: '100%', height: '180px', background: '#fff', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#999' }}>
                [ Radar Chart หรือ Bar Chart แสดงสัดส่วนคะแนน ]
              </div>
            </div>
            <div className="big-card" style={{ minHeight: '250px' }}>
              <h4 style={{ marginBottom: '15px' }}>แนวโน้มคะแนน 6 เดือน</h4>
              <div style={{ width: '100%', height: '180px', background: '#fff', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#999' }}>
                [ Line Chart แสดงแนวโน้ม ]
              </div>
            </div>
          </div>

          {/* 3. Staff List Table */}
          <div className="big-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>รายชื่อบุคลากร</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="ค้นหาบุคลากร..." className="search-input" style={{ width: '250px' }} />
                <select className="search-input" style={{ width: '120px' }}>
                  <option>ทั้งหมด</option>
                  <option>พยาบาล</option>
                </select>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#888', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                  <th style={{ padding: '15px' }}>บุคลากร</th>
                  <th style={{ padding: '15px' }}>ตำแหน่ง</th>
                  <th style={{ padding: '15px' }}>คะแนนเฉลี่ย</th>
                  <th style={{ padding: '15px' }}>งานดูแล</th>
                  <th style={{ padding: '15px' }}>ความพึงพอใจ</th>
                  <th style={{ padding: '15px' }}>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '12px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: `url(${staff.avatar})`, backgroundSize: 'cover' }}></div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{staff.name}</div>
                          <div style={{ fontSize: '12px', color: '#999' }}>ID: {staff.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', color: '#2563eb' }}>{staff.role}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
                        <span style={{ fontWeight: 'bold' }}>{staff.score}</span>
                        <span style={{ fontSize: '12px', color: '#ccc' }}>/ 5.0</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{4.5 + (index/10)}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{20 + index * 3}</td>
                    <td style={{ padding: '15px' }}>
                      <button style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                        ดูรายละเอียด
                      </button>
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

      {/* --- Bottom Bar (Mobile) --- */}
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
          <i className="fa-solid fa-chart-bar"></i>
          <div>Report</div>
        </div>
        <div className="bottom-item">
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

export default AdminReportsEstimate;