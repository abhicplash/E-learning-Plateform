import { useAuth } from "../features/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => setView(!view);

  return (
    <div className="nav-wrapper">
      <Link to={"/"}>
        <h2>E</h2>
      </Link>

      {view && user && (
        <div className="list-Mob">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Courses</Link>
          {user?.isAdmin && (
            <Link to="/admin" onClick={closeMenu}>
              Admin Panel
            </Link>
          )}
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {user && (
        <div className="list-Large">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Courses</Link>
          {user?.isAdmin && (
            <Link to="/admin" onClick={closeMenu}>
              Admin Panel
            </Link>
          )}
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="nav-icon">
        <FaBars onClick={closeMenu} />
      </div>
    </div>
  );
}

export default Navbar;
