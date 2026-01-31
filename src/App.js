//import Dashboard from "./Coponent/Admin_dashboard";
//import AdminUserChat from "./Coponent/Admin_User_Chat"; 
//import UserMain from "./Coponent/Admin_User_Main"; // 
import AdminUserMain from "./Coponent/Admin_User_Main";
//import AdminTaskMain from "./Coponent/AdminTask";
//import Setting from "./Coponent/AdminSetting";
//import AdminReportMain from "./Coponent/Admin_Reports";
//import AdminReportsEstimate from "./Coponent/AdminReportsEstimate";
//import AdminReportsEstimateDetail from "./Coponent/AdminReportsEstimateDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* หน้าแรกให้แสดง Dashboard */}
          <Route path="/" element={<AdminUserMain />} />
          
          {/* ตัวอย่างการเพิ่มหน้าอื่นๆ ในอนาคต */}
          {/* <Route path="/user" element={<UserMain />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;