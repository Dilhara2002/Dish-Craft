
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual login/authentication logic here
    console.log('Login form submitted:', formData);
    navigate('/Home');
  };

  // Styles
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
      padding: "32px 24px",
      textAlign: "center"
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#ffffff",
      margin: 0
    },
    headerSubtitle: {
      color: "#fef3c7",
      fontSize: "14px",
      marginTop: "8px",
      marginBottom: 0
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
      marginBottom: "8px"
    },
    input: {
      display: "block",
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease-in-out",
      fontSize: "16px"
    },
    inputFocus: {
      borderColor: "#f59e0b",
      boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)"
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    checkbox: {
      width: "16px",
      height: "16px",
      accentColor: "#f59e0b",
      cursor: "pointer"
    },
    flexBetween: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px"
    },
    link: {
      color: "#d97706",
      textDecoration: "none",
      fontSize: "14px",
      transition: "all 0.2s ease",
      ":hover": {
        color: "#f59e0b",
        textDecoration: "underline"
      }
    },
    button: {
      width: "100%",
      backgroundColor: "#f59e0b",
      color: "#ffffff",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      ":hover": {
        backgroundColor: "#d97706"
      }
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: "24px 0",
      color: "#6b7280",
      fontSize: "14px",
      "::before, ::after": {
        content: '""',
        flex: 1,
        borderBottom: "1px solid #e5e7eb"
      },
      "::before": {
        marginRight: "16px"
      },
      "::after": {
        marginLeft: "16px"
      }
    },
    socialButtonsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      margin: "24px 0"
    },
    socialButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px",
      backgroundColor: "#ffffff",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      ":hover": {
        backgroundColor: "#f9fafb"
      }
    },
    signupText: {
      textAlign: "center",
      color: "#4b5563",
      fontSize: "14px",
      marginTop: "32px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Welcome to Dish Craft</h1>
          <p style={styles.headerSubtitle}>Share your culinary journey</p>
        </header>

        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(isFocused.email && styles.inputFocus)
                }}
                placeholder="your@email.com"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
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
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(isFocused.password && styles.inputFocus)
                }}
                placeholder="••••••••"
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                required
                minLength="6"
              />
            </div>

            <div style={styles.flexBetween}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="remember-me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <label htmlFor="remember-me" style={styles.label}>
                  Remember me
                </label>
              </div>

              <a 
                href="#forgot-password" 
                style={styles.link}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" style={styles.button}>
              Sign In
            </button>
          </form>

          <div style={styles.divider}>
            <span>Or continue with</span>
          </div>

          <div style={styles.socialButtonsContainer}>
            <button 
              type="button" 
              style={styles.socialButton}
              onClick={() => console.log('YouTube login')}
            >
              YouTube
            </button>
            <button 
              type="button" 
              style={styles.socialButton}
              onClick={() => console.log('Facebook login')}
            >
              Facebook
            </button>
          </div>

          <p style={styles.signupText}>
            Don't have an account?{' '}
            <a 
              href="/register" 
              style={styles.link}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/authenticate', {
        email,
        password
      });

      const { token, id } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);

      // Show success toast
      setToastType('success');
      setToastMessage('Login successful! Redirecting to your profile...');
      setShowToast(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      
      // Show error toast
      setToastType('danger');
      setToastMessage(errorMsg);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid bg-light" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0 fw-bold">
                <LogIn className="me-2" size={24} />
                Sign In
              </h3>
              <p className="text-white-50 mb-0">Access your account</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email-address" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="form-control"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={18} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="form-control"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-white"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember-me"
                    />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-decoration-none text-primary">
                    Forgot password?
                  </a>
                </div>
                
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <AlertCircle className="me-2" size={18} />
                    <div>{error}</div>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center py-3 bg-light">
              <div className="text-muted">
                Don't have an account?{' '}
                <a href="/register" className="text-decoration-none text-primary fw-semibold">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-muted">
              &copy; {new Date().getFullYear()} Dish-Craft. All rights reserved.
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
          top: '15%', 
          left: '10%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(255,255,255,0) 70%)'
        }}></div>
        <div className="position-absolute" style={{ 
          bottom: '10%', 
          right: '5%', 
          width: '400px', 
          height: '400px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(25,135,84,0.1) 0%, rgba(255,255,255,0) 70%)'
        }}></div>
      </div>

    </div>
  );
};

export default Login;