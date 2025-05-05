const Login = () => {
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
      padding: "32px"
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
    },
    inputFocus: {
      borderColor: "#f59e0b",
      boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.2)"
    },
    checkbox: {
      height: "16px",
      width: "16px",
      color: "#d97706",
      borderColor: "#d1d5db",
      borderRadius: "4px"
    },
    checkboxLabel: {
      marginLeft: "8px",
      fontSize: "14px",
      color: "#374151"
    },
    flexBetween: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px"
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center"
    },
    link: {
      fontSize: "14px",
      color: "#d97706",
      textDecoration: "none"
    },
    linkHover: {
      color: "#f59e0b",
      textDecoration: "underline"
    },
    button: {
      width: "100%",
      backgroundColor: "#f59e0b",
      color: "#ffffff",
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
      fontWeight: "500"
    },
    buttonHover: {
      backgroundColor: "#d97706"
    },
    divider: {
      position: "relative",
      marginTop: "24px",
      marginBottom: "24px"
    },
    dividerLine: {
      position: "absolute",
      top: "50%",
      width: "100%",
      borderTop: "1px solid #e5e7eb"
    },
    dividerText: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      fontSize: "14px"
    },
    dividerTextSpan: {
      padding: "0 8px",
      backgroundColor: "#ffffff",
      color: "#6b7280"
    },
    socialButtonsContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginTop: "24px"
    },
    socialButton: {
      backgroundColor: "#ffffff",
      padding: "8px 16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      cursor: "pointer"
    },
    socialButtonHover: {
      backgroundColor: "#f9fafb"
    },
    signupText: {
      marginTop: "32px",
      textAlign: "center",
      fontSize: "14px",
      color: "#4b5563"
    },
    signupLink: {
      color: "#d97706",
      fontWeight: "500",
      textDecoration: "none"
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Welcome to Dish Craft</h1>
          <p style={styles.headerSubtitle}>Share your culinary journey</p>
        </div>

        {/* Login Form */}
        <div style={styles.formContainer}>
          <form>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                style={styles.input}
                placeholder="your@email.com"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                style={styles.input}
                placeholder="••••••••"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={styles.flexBetween}>
              <div style={styles.checkboxContainer}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  style={styles.checkbox}
                />
                <label htmlFor="remember-me" style={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>

              <a 
                href="#" 
                style={styles.link}
                onMouseOver={(e) => e.target.style.color = "#f59e0b"}
                onMouseOut={(e) => e.target.style.color = "#d97706"}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = "#d97706"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#f59e0b"}
            >
              Sign In
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <div style={styles.dividerText}>
              <span style={styles.dividerTextSpan}>Or continue with</span>
            </div>
          </div>

          <div style={styles.socialButtonsContainer}>
            <button 
            href="register" 
              style={styles.socialButton}
              onMouseOver={(e) => e.target.style.backgroundColor = "#f9fafb"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ffffff"}
            >
              YouTube
            </button>
            <button 
            href="register" 
              style={styles.socialButton}
              onMouseOver={(e) => e.target.style.backgroundColor = "#f9fafb"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#ffffff"}
            >
              Facebook
            </button>
          </div>

          <p style={styles.signupText}>
            Don't have an account?{' '}
            <a 
              href="register" 
              style={styles.signupLink}
              onMouseOver={(e) => e.target.style.textDecoration = "underline"}
              onMouseOut={(e) => e.target.style.textDecoration = "none"}
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