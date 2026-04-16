import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await API.post("register/", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <>
      <div className="navbar">Appointment System</div>

      <div className="container">
        <div className="card">
          <h2>Register</h2>

          <input placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })} />

          <input placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <input type="password" placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

          <button onClick={handleSubmit}>Register</button>
        </div>
      </div>
    </>
  );
}

export default Register;