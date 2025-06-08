import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, "course", id);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() });
        }
      } catch (error) {
        console.error("Error loading Course details", error);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>
        <strong>Instructor:</strong> {course.instructor}
      </p>
      <p>
        <strong>Price:</strong> {course.price}
      </p>
    </div>
  );
};

export default CourseDetails;
