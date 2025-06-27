import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";
import "../styles/CourseList.css";
import Layout from "../components/Layout";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "course"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const getYoutubeThumbnail = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : null;
    } catch {
      return null;
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <Layout>
      <div className="CourseList-wrapper">
        <h2>All Courses</h2>
        <ul className="course-container">
          {courses.map((course) => {
            const thumbnail = getYoutubeThumbnail(course.videoUrl);
            return (
              <li key={course.id} className="course-wrapper">
                {thumbnail && <img src={thumbnail} alt="Course thumbnail" />}
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <Link to={`/courses/${course.id}`}>
                    <button>watch</button>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default CourseList;
