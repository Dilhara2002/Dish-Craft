
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  // Toast auto-hide
  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (form.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Send only needed fields to backend
      const registerData = {
        username: form.username,
        email: form.email,
        password: form.password
      };
      
      await axios.post('http://localhost:8080/api/auth/register', registerData);
      
      // Show success toast
      setToastType('success');
      setToastMessage('Registration successful! Please log in.');
      setShowToast(true);
      
      // Clear form
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      
      // Show error toast
      setToastType('danger');
      setToastMessage(errorMsg);
      setShowToast(true);
      
      // Check for specific errors
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="container-fluid bg-light" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0 fw-bold">
                <UserPlus className="me-2" size={24} />
                Create Account
              </h3>
              <p className="text-white-50 mb-0">Join our community today</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <User size={18} />
                    </span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                    {errors.username && (
                      <div className="invalid-feedback">
                        {errors.username}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-white"
                      onClick={() => togglePasswordVisibility('password')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <small className="form-text text-muted">
                    Use at least 6 characters
                  </small>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <CheckCircle size={18} />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-white"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center py-3 bg-light">
              <div className="text-muted">
                Already have an account?{' '}
                <a href="/login" className="text-decoration-none text-primary fw-semibold">
                  Sign in
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-muted">
              By signing up, you agree to our <a href="#" className="text-decoration-none">Terms</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div 
          className={`toast ${showToast ? 'show' : 'hide'} text-white bg-${toastType}`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body d-flex align-items-center">
              {toastType === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              ) : (
                <AlertCircle className="me-2" size={16} />
              )}
              {toastMessage}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      </div>
      
      {/* Optional: Background animation */}
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="position-absolute" style={{ 
          top: '25%', 
          right: '15%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(255,255,255,0) 70%)'
        }}></div>
        <div className="position-absolute" style={{ 
          bottom: '20%', 
          left: '10%', 
          width: '400px', 
          height: '400px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(25,135,84,0.1) 0%, rgba(255,255,255,0) 70%)'
        }}></div>
      </div>

    </div>
  );
};

export default Register;