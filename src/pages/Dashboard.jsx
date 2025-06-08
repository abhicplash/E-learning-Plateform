import React from "react";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <div>
      <h1>welcome to dash board</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Dashboard;
