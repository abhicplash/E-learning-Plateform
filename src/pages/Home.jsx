import React from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../features/AuthContext";
import "../styles/Home.css";
import home from "../assets/home.png";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to logout.  ");
    }
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="home-info-wrapper">
          <h1>
            For every student ,<br />
            every classroom
          </h1>
          <p>Learn new skills everytime</p>
          <Link to={"/dashboard"}>
            <button>Explore</button>
          </Link>
        </div>
        <div className="home-image-wrapper">
          <img src={home} alt="" className="home-img" />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
