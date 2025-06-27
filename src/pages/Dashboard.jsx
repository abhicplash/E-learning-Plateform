import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../features/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [enrollments, setEnrollments] = useState([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("error logging out", error);
      alert("Failed to logout.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setEnrollments(userData.enrollments || []);
        setProgress(userData.progress || {});
      }

      const courseSnap = await getDocs(collection(db, "course"));
      const allCourses = courseSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(allCourses);
    };

    fetchData();
  }, [user]);

  const getCourseProgress = (courseId, lessons) => {
    const completed = progress?.[courseId]?.completedLessons?.length || 0;
    const total = lessons?.length || 1;
    return Math.round((completed / total) * 100);
  };

  return (
    <Layout>
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2>Welcome, {user?.email}</h2>
        </div>

        <section className="enrolled-section">
          <h3>Your Enrolled Courses</h3>
          {enrollments.length === 0 ? (
            <p>
              No enrollments yet.
              <Link to="/courses" className="browse-link">
                {" "}
                Browse Courses
              </Link>
            </p>
          ) : (
            <div className="course-grid">
              {courses
                .filter((course) => enrollments.includes(course.id))
                .map((course) => {
                  const percent = getCourseProgress(course.id, course.lessons);
                  return (
                    <div key={course.id} className="progress-card">
                      <h4>{course.title}</h4>
                      <div className="progress-bar-wrapper">
                        <div
                          className="progress-fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p>{percent}% completed</p>
                      <Link to={`/courses/${course.id}`}>
                        <button>Resume</button>
                      </Link>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
