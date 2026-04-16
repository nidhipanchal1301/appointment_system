import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles.css";

function Providers() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("providers/", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setProviders(res.data));
  }, []);

  return (
    <>
      <div className="navbar">Service Providers</div>

      <div className="container">
        <div className="grid">
          {providers.map((p) => (
            <div className="providerCard" key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.service_type}</p>
              <p>{p.phone}</p>
              <p>{p.is_available ? "Available" : "Not Available"}</p>

              <button onClick={() => navigate(`/book/${p.id}`)}>
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Providers;