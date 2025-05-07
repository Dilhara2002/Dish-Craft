// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual login logic
    console.log('Logging in with', formData);
    navigate('/Home');
  };

  const styles = {
    // [same styling object you provided earlier]
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
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                style={{
                  ...styles.input,
                  ...(isFocused.email && styles.inputFocus),
                }}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                style={{
                  ...styles.input,
                  ...(isFocused.password && styles.inputFocus),
                }}
                required
                minLength={6}
              />
            </div>

            <div style={styles.flexBetween}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <label htmlFor="rememberMe" style={styles.label}>
                  Remember me
                </label>
              </div>
              <a href="#" style={styles.link}>Forgot password?</a>
            </div>

            <button type="submit" style={styles.button}>Sign In</button>
          </form>

          <div style={styles.divider}>
            <span>Or continue with</span>
          </div>

          <div style={styles.socialButtonsContainer}>
            <button type="button" style={styles.socialButton}>
              YouTube
            </button>
            <button type="button" style={styles.socialButton}>
              Facebook
            </button>
          </div>

          <p style={styles.signupText}>
            Don't have an account? <a href="/register" style={styles.link}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
