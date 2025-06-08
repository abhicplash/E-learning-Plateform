import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";

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
    <div>
      <h2>All Courses</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {courses.map((course) => {
          const thumbnail = getYoutubeThumbnail(course.videoUrl);
          return (
            <li key={course.id} style={{ marginBottom: "20px" }}>
              <Link
                to={`/courses/${course.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt="Course thumbnail"
                    style={{ width: "200px", height: "auto", display: "block" }}
                  />
                )}
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CourseList;
