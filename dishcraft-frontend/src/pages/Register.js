import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #fff7ed, #fef3c7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    },
    card: {
      width: "100%",
      maxWidth: "448px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      overflow: "hidden"
    },
    header: {
      backgroundColor: "#f59e0b",
      padding: "16px 24px"
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center"
    },
    headerSubtitle: {
      color: "#fef3c7",
      fontSize: "14px",
      textAlign: "center",
      marginTop: "4px"
    },
    formContainer: {
      padding: "50px"
    },
    formGroup: {
      marginBottom: "24px"
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "4px"
    },
    input: {
      marginTop: "4px",
      display: "block",
      width: "100%",
      padding: "8px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.2s ease-in-out",
      marginBottom: "16px"
    },
    button: {
      width: "100%",
      backgroundColor: "#f59e0b",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
      fontWeight: "500",
      fontSize: "16px"
    },
    loginText: {
      marginTop: "24px",
      textAlign: "center",
      fontSize: "14px",
      color: "#4b5563"
    },
    loginLink: {
      color: "#d97706",
      fontWeight: "500",
      textDecoration: "none",
      cursor: "pointer"
    }
  };

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
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  // Handle focus events for input styling
  const handleFocus = (e) => {
    e.target.style.borderColor = "#f59e0b";
    e.target.style.boxShadow = "0 0 0 2px rgba(245, 158, 11, 0.2)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#d1d5db";
    e.target.style.boxShadow = "none";
  };

  // Handle navigation to login page
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header with food-themed accent */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Join Dish Craft</h1>
          <p style={styles.headerSubtitle}>Create your culinary account</p>
        </div>

        {/* Registration Form */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                style={styles.input}
                placeholder="Your username"
                value={formData.username}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                style={styles.input}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                style={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = "#d97706"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#f59e0b"}
            >
              Create Account
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account?{' '}
            <span
              style={styles.loginLink}
              onClick={goToLogin}
              onMouseOver={(e) => e.target.style.textDecoration = "underline"}
              onMouseOut={(e) => e.target.style.textDecoration = "none"}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;