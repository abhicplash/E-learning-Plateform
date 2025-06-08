import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

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
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserEnrollments(data.enrollments || []);
          setUserProgress(
            (data.progress && data.progress[id]?.completedLessons) || []
          );
        }
      }
    };

    fetchCourse();
    fetchUserData();
  }, [id]);

  const getYoutubeEmbedUrl = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return null;
    }
  };

  const handleEnroll = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to enroll.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        enrollments: arrayUnion(course.id),
      });
      alert("Enrolled successfully!");
      setUserEnrollments((prev) => [...prev, course.id]);
    } catch (err) {
      console.error("Error enrolling:", err);
    }
  };

  const markLessonComplete = async (lessonIndex) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to mark lesson complete.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const courseProgressField = `progress.${course.id}.completedLessons`;

    try {
      if (userProgress.includes(lessonIndex)) {
        alert("Lesson already marked complete!");
        return;
      }

      await updateDoc(userRef, {
        [courseProgressField]: arrayUnion(lessonIndex),
      });

      setUserProgress((prev) => [...prev, lessonIndex]);
      alert("Lesson marked as complete!");
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;

  const isEnrolled = userEnrollments.includes(course.id);

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

      <button onClick={handleEnroll} disabled={isEnrolled}>
        {isEnrolled ? "Already Enrolled" : "Enroll Now"}
      </button>

      {course.videoUrl && (
        <div style={{ marginTop: "20px" }}>
          {isEnrolled ? (
            <iframe
              width="560"
              height="315"
              src={getYoutubeEmbedUrl(course.videoUrl)}
              title="Course Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p>Please enroll to watch the course video.</p>
          )}
        </div>
      )}

      {course.lessons && Array.isArray(course.lessons) && (
        <div style={{ marginTop: "30px" }}>
          <h3>Lessons</h3>
          {course.lessons.map((lesson, index) => (
            <div key={index} style={{ marginTop: "20px" }}>
              <h4>{lesson.title}</h4>
              {isEnrolled ? (
                <iframe
                  width="560"
                  height="315"
                  src={getYoutubeEmbedUrl(lesson.videoUrl)}
                  title={`Lesson ${index + 1}`}
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Please enroll to watch this lesson.</p>
              )}
              {isEnrolled && (
                <button
                  onClick={() => markLessonComplete(index)}
                  disabled={userProgress.includes(index)}
                  style={{ marginTop: "10px" }}
                >
                  {userProgress.includes(index) ? "Completed" : "Mark Complete"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;