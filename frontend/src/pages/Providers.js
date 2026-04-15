import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Providers() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const res = await API.get("providers/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProviders(res.data);

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      setError("Failed to load providers");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Service Providers</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={styles.grid}>
        {providers.map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.name}</h3>
            <p>Service: {p.service_type}</p>
            <p>Phone: {p.phone}</p>
            <p>Status: {p.is_available ? "Available" : "Not Available"}</p>

            {/* ✅ IMPORTANT: connect booking flow */}
            <button
              style={styles.button}
              onClick={() => navigate(`/book/${p.id}`)}
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  card: {
    width: "260px",
    padding: "15px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
    background: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Providers;