import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles.css";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.access);
      navigate("/providers");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <>
      <div className="navbar">Appointment System</div>

      <div className="container">
        <div className="card">
          <h2>Login</h2>

          <input placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} />

          <input type="password" placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </>
  );
}

export default Login;