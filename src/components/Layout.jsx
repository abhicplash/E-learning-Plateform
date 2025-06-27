import React from "react";
import Navbar from "./Navbar";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Layout;
