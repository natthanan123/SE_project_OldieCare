import React from 'react';
import logoImg from "./Images/logo-oldie.png";
import './Component.css';
// หมายเหตุ: คุณสามารถแยก CSS ของ Report ไปไว้ใน Report.css หรือเขียน inline แบบตัวอย่างนี้ก็ได้ครับ

const AdminReportMain = () => {
  return (
    <div className="admin-user-wrapper">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet"></link>
      
      {/* --- Top Bar --- */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-box">
            <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Admin Reports</div>
        </div>

        <div className="topbar-right">
          <div className="noti-box">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className="profile-img" style={{ backgroundImage: `url('https://i.pravatar.cc/150?u=admin')`, backgroundSize: 'cover' }}></div>
          <div className="profile-info">
            <div className="name">Admin Name</div>
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
          <div className="menu-item active">
            <span className="menu-icon"><i className="fa-solid fa-chart-bar"></i></span> Report
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-tasks"></i></span> Task
          </div>
          <div className="menu-item">
            <span className="menu-icon"><i className="fa-solid fa-cog"></i></span> Setting
          </div>
        </div>

        {/* --- Main Content (อ้างอิงจากรูปภาพ) --- */}
        <div className="content" style={{ backgroundColor: '#f8f9fa' }}>
          
          {/* 1. Summary Cards */}
          <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box blue"><i className="fa-solid fa-dollar-sign"></i></div>
                <span style={{ color: '#10b981', fontSize: '12px' }}>+12.5%</span>
              </div>
              <div className="title" style={{ marginTop: '10px' }}>Total Revenue</div>
              <div className="number">$847,392</div>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box purple"><i className="fa-solid fa-users"></i></div>
                <span style={{ color: '#3b82f6', fontSize: '12px' }}>+8.2%</span>
              </div>
              <div className="title" style={{ marginTop: '10px' }}>Active Users</div>
              <div className="number">24,847</div>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box red"><i className="fa-solid fa-cart-shopping"></i></div>
                <span style={{ color: '#ef4444', fontSize: '12px' }}>-2.1%</span>
              </div>
              <div className="title" style={{ marginTop: '10px' }}>Total Orders</div>
              <div className="number">1,847</div>
            </div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="icon-box yellow"><i className="fa-solid fa-chart-line"></i></div>
                <span style={{ color: '#10b981', fontSize: '12px' }}>+5.4%</span>
              </div>
              <div className="title" style={{ marginTop: '10px' }}>Conversion Rate</div>
              <div className="number">3.42%</div>
            </div>
          </div>

          {/* 2. Charts Row (Placeholder) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div className="big-card" style={{ minHeight: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>Revenue Overview</h4>
                <div style={{ fontSize: '12px', color: '#666' }}>7 Days | 30 Days</div>
              </div>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f4ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                [ Revenue Chart Visualization ]
              </div>
            </div>
            <div className="big-card" style={{ minHeight: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>User Activity</h4>
                <div style={{ fontSize: '12px', color: '#666' }}>Active Users</div>
              </div>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f4ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                [ Activity Bar Chart ]
              </div>
            </div>
          </div>

          {/* 3. Recent Reports Table */}
          <div className="big-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Recent Reports</h3>
              <div>
                <button className="tab" style={{ marginRight: '10px' }}>Filter</button>
                <button className="btn plus" style={{ width: 'auto', padding: '0 15px' }}>Generate</button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', color: '#666', fontSize: '14px' }}>
                  <th style={{ padding: '12px' }}>Report Name</th>
                  <th style={{ padding: '12px' }}>Type</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Generated</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>Sales Report Q4</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Financial overview</div>
                  </td>
                  <td style={{ padding: '12px' }}>PDF</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>Completed</span></td>
                  <td style={{ padding: '12px', color: '#666' }}>2 hours ago</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: '#3b82f6', cursor: 'pointer', marginRight: '10px' }}>Download</span>
                    <span style={{ color: '#ef4444', cursor: 'pointer' }}>Delete</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold' }}>User Analytics</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>Behavioral data</div>
                  </td>
                  <td style={{ padding: '12px' }}>Excel</td>
                  <td style={{ padding: '12px' }}><span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Processing</span></td>
                  <td style={{ padding: '12px', color: '#666' }}>5 hours ago</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ color: '#ccc', cursor: 'not-allowed', marginRight: '10px' }}>Download</span>
                    <span style={{ color: '#ef4444', cursor: 'pointer' }}>Delete</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
      
      {/* ประเมิน Button (Floating หรือจัดตำแหน่งตามรูป) */}
      <div style={{ position: 'fixed', bottom: '110px', right: '30px', zIndex: 100 }}>
         <button style={{ backgroundColor: '#4facfe', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            ประเมิน
         </button>
      </div>

    </div>
  );
};

export default AdminReportMain;