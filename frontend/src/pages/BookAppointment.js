import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function BookAppointment() {
  const { id } = useParams(); // provider id from URL

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET AVAILABLE SLOTS
  // =========================
  const getSlots = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `slots/?provider=${id}&date=${date}`
      );

      setSlots(res.data);
      setSelectedSlot(null);

    } catch (err) {
      console.log("SLOT ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // BOOK APPOINTMENT
  // =========================
  const bookAppointment = async () => {
    try {
      if (!selectedSlot) {
        alert("Please select a slot");
        return;
      }

      if (!date) {
        alert("Please select a date");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await API.post(
        "appointments/create/",
        {
          provider: Number(id), // FIX 1: convert string → number
          date: date,
          start_time: selectedSlot.start_time.slice(0, 5), // FIX 2
          end_time: selectedSlot.end_time.slice(0, 5),     // FIX 2
          status: "PENDING",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment Booked Successfully 🎉");
      console.log("BOOKED:", res.data);

      // reset
      setSelectedSlot(null);

    } catch (err) {
      console.log("BOOKING ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data)); // FIX 3: show real error
    }
  };

  return (
    <div style={styles.container}>
      <h2>Book Appointment</h2>

      {/* Provider */}
      <p style={styles.info}>
        Provider ID: {id}
      </p>

      {/* Date */}
      <input
        type="date"
        style={styles.input}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Get Slots */}
      <button style={styles.button} onClick={getSlots}>
        Get Available Slots
      </button>

      {/* Loading */}
      {loading && <p>Loading slots...</p>}

      {/* Slots UI */}
      <div style={styles.slotContainer}>
        {slots.length === 0 && !loading && (
          <p>No slots available</p>
        )}

        {slots.map((slot, index) => (
          <div
            key={index}
            onClick={() => setSelectedSlot(slot)}
            style={{
              ...styles.slot,
              background:
                selectedSlot === slot ? "#4CAF50" : "#f0f0f0",
              color:
                selectedSlot === slot ? "white" : "black",
            }}
          >
            {slot.start_time} - {slot.end_time}
          </div>
        ))}
      </div>

      {/* Book Button */}
      <button style={styles.bookBtn} onClick={bookAppointment}>
        Book Appointment
      </button>
    </div>
  );
}

export default BookAppointment;

// =========================
// STYLES
// =========================
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  info: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    margin: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    margin: "10px",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  slotContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  slot: {
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #ddd",
    minWidth: "120px",
  },
  bookBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};