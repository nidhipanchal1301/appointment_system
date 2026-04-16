import React, { useEffect, useState } from "react";
import API from "../api/api";
import "../styles.css";


function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get("appointments/").then((res) =>
      setAppointments(res.data)
    );
  }, []);

  return (
    <>
      <div className="navbar">My Appointments</div>

      <div className="container">
        <div className="card" style={{ width: "600px" }}>

          <h2>Appointments</h2>

          {appointments.map((a) => (
            <div
              key={a.id}
              className="providerCard"
              style={{ marginBottom: "10px" }}
            >
              <p><b>Provider:</b> {a.provider_name}</p>
              <p><b>Date:</b> {a.date}</p>
              <p><b>Time:</b> {a.start_time}</p>
              <p><b>Status:</b> {a.status}</p>
            </div>
          ))}

        </div>
      </div>
    </>
  );
}

export default Appointments;