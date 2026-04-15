import React, { useEffect, useState } from "react";
import API from "../api/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get("appointments/").then((res) => setAppointments(res.data));
  }, []);

  return (
    <div>
      <h2>Appointments</h2>
      {appointments.map((a) => (
        <div key={a.id}>
          <p>{a.provider_name} | {a.date} | {a.start_time}</p>
        </div>
      ))}
    </div>
  );
}

export default Appointments;