import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Providers from "./pages/Providers";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";


// 🔐 Private Route (auth guard)
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 DEFAULT ROUTE → REGISTER FIRST */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* AUTH PAGES */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED PAGES */}
        <Route
          path="/providers"
          element={
            <PrivateRoute>
              <Providers />
            </PrivateRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookAppointment />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />

        {/* ❌ UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/register" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;