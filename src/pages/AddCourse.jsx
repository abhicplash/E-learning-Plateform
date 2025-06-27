import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "../styles/AddCourse.css";

const AddCourse = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    price: "",
    videoUrl: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "course"), form);
      alert("Course added!");
      setForm({
        title: "",
        description: "",
        instructor: "",
        price: "",
        videoUrl: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  if (loading) return <p>Checking admin status...</p>;
  if (!isAdmin) return <p>Access denied. Admins only.</p>;

  return (
    <div className="add-course-wrapper">
      <h2>Add New Course</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="instructor">Instructor</label>
        <input
          name="instructor"
          placeholder="Instructor"
          value={form.instructor}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="videoUrl">YouTube Video URL</label>
        <input
          name="videoUrl"
          placeholder="Video URL"
          value={form.videoUrl}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
