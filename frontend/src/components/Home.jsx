import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ComplaintList from "./ComplaintList";
import ComplaintForm from "./ComplaintForm";
import "../App.css";
import "./Login.css";
import "./Register.css";
import "./Home.css";
import "./ComplaintList.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/getuser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Handle error (redirect, show message, etc.)
        navigate("/login");
      }
    };

    fetchUser();
  }, []); // Empty dependency array ensures this effect runs once on mount

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const goToMapPage = () => {
    navigate("/map");
  };

  return (
    <div className="home-container">
      <div className="home-box">
        <h2 className="home-title">Home</h2>
        {user ? (
          <div>
            <h3 className="welcome-text">
              Welcome {user.isAdmin ? "Admin" : "User"}
            </h3>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
        <button className="map-button" onClick={goToMapPage}>
          Go to Map
        </button>
      </div>
      <div className="complaint-section">
        {!user?.isAdmin && <ComplaintForm user={user} />}{" "}
        {/* Render ComplaintForm only if not admin */}
        <ComplaintList user={user} />
      </div>
    </div>
  );
};

export default Home;
