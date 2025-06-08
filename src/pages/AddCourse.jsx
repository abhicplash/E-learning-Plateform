import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

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
    <div>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="instructor"
          placeholder="Instructor"
          value={form.instructor}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="videoUrl"
          placeholder="YouTube Video URL"
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
