import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouses = async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading Courses");
      }
    };
    fetchCouses();
  }, []);

  if (loading) return <p>Loading Courses</p>;

  return (
    <div>
      <h2>ِall courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
