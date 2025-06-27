import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import "../styles/CourseDetails.css";
import Layout from "../components/Layout";

const fetchCourse = async ({ queryKey }) => {
  const [, id] = queryKey;
  const courseRef = doc(db, "course", id);
  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) throw new Error("Course not found");
  return { id: courseSnap.id, ...courseSnap.data() };
};

const fetchUserData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User data not found");

  const data = userSnap.data();
  return {
    enrollments: data.enrollments || [],
    progress: data.progress || {},
  };
};

const CourseDetails = () => {
  const { id } = useParams();
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [userProgress, setUserProgress] = useState([]);

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: fetchCourse,
  });

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    enabled: !!auth.currentUser,
    onSuccess: (data) => {
      setUserEnrollments(data.enrollments);
      setUserProgress(data.progress[id]?.completedLessons || []);
    },
  });

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

  if (courseLoading || userLoading) return <p>Loading course...</p>;
  if (courseError || userError)
    return <p>Error: {courseError?.message || userError?.message}</p>;

  if (!course) return <p>Course not found.</p>;

  const isEnrolled = userEnrollments.includes(course.id);

  return (
    <Layout>
      <div className="course-details-wrapper">
        <div className="course-header">
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
        </div>

        {course.videoUrl && (
          <div className="video-section">
            <h3>Course Intro</h3>
            {isEnrolled ? (
              <iframe
                width="100%"
                height="400"
                src={getYoutubeEmbedUrl(course.videoUrl)}
                title="Course Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="enroll-note">
                Please enroll to watch the course video.
              </p>
            )}
          </div>
        )}

        {course.lessons && course.lessons.length > 0 && (
          <div className="lessons-section">
            <h3>Lessons</h3>
            {course.lessons.map((lesson, index) => (
              <div key={index} className="lesson-card">
                <h4>{lesson.title}</h4>
                {isEnrolled ? (
                  <iframe
                    width="100%"
                    height="300"
                    src={getYoutubeEmbedUrl(lesson.videoUrl)}
                    title={`Lesson ${index + 1}`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p className="enroll-note">
                    Please enroll to watch this lesson.
                  </p>
                )}
                {isEnrolled && (
                  <button
                    onClick={() => markLessonComplete(index)}
                    disabled={userProgress.includes(index)}
                  >
                    {userProgress.includes(index)
                      ? "Completed"
                      : "Mark Complete"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseDetails;
