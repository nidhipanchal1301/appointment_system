import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import "../styles.css";


function BookAppointment() {
  const { id } = useParams(); // provider id from URL

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSlots = async () => {
    try {
      setLoading(true);

      const res = await API.get(`slots/?provider=${id}&date=${date}`);
      setSlots(res.data);
      setSelectedSlot(null);
    } catch (err) {
      alert("Error fetching slots");
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    try {
      if (!selectedSlot) return alert("Select slot");
      if (!date) return alert("Select date");

      const token = localStorage.getItem("token");

      await API.post(
        "appointments/create/",
        {
          provider: Number(id),
          date,
          start_time: selectedSlot.start_time.slice(0, 5),
          end_time: selectedSlot.end_time.slice(0, 5),
          status: "PENDING",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Appointment Booked 🎉");
      setSelectedSlot(null);
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <>
      <div className="navbar">Book Appointment</div>

      <div className="container">
        <div className="card">

          <h2>Book Slot</h2>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={getSlots}>
            Get Available Slots
          </button>

          {loading && <p>Loading...</p>}

          <div style={{ marginTop: "15px" }}>
            {slots.length === 0 && !loading && (
              <p>No slots available</p>
            )}

            {slots.map((slot, i) => (
              <div
                key={i}
                className={`slot ${
                  selectedSlot === slot ? "active" : ""
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.start_time} - {slot.end_time}
              </div>
            ))}
          </div>

          <button onClick={bookAppointment}>
            Book Appointment
          </button>

        </div>
      </div>
    </>
  );
}

export default BookAppointment;