import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import axios from "../api/axios"; // make sure this file exists

const Register = () => {
  const navigate = useNavigate(); // ✅ create navigate hook

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/users", formData);
      alert("Registration successful!");
      navigate("/login"); // ✅ navigate to login page
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
