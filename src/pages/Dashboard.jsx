import React from "react";

const Dashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to Your Dashboard</h2>
      <section>
        <h3>Your Enrolled Courses</h3>
        {/* Map through enrolled courses */}
        <p>
          No enrollments yet. <a href="/courses">Browse Courses</a>
        </p>
      </section>

      <section>
        <h3>Learning Progress</h3>
        {/* Show progress bars (optional for now) */}
      </section>
    </div>
  );
};

export default Dashboard;
