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
                minLength="8"
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
    </div>
  );
};

export default Login;