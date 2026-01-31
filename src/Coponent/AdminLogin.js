import { useState } from "react";
import "../Coponent/Login.css"; // ออกไป 1 ชั้นเพื่อหาไฟล์ App.css
import bgImage from "./Images/bg-oldie.jpg";
import logoImg from "./Images/logo-oldie.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-container">
      {/* ส่วนรูปภาพฝั่งซ้าย */}
      <div
        className="login-image-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* ส่วนฟอร์มฝั่งขวา */}
      <div className="login-form-section">
        <div className="logo-header">
          <div className="logo-badge">
            <img src={logoImg} alt="Logo" className="main-logo" />
            <h1 className="logo-text">OldieCare</h1>
          </div>
          <p className="sub-text">Company Dashboard</p>
        </div>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <h2 className="form-title">Login</h2>

          <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn-login">
            Login
          </button>
          <a href="#forgot" className="forgot-link">
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
