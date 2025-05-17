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
    
    if (form.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
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
      const registerData = {
        username: form.username,
        email: form.email,
        password: form.password
      };
      
      await axios.post('http://localhost:8080/api/auth/register', registerData);
      
      setToastType('success');
      setToastMessage('Registration successful! Please log in.');
      setShowToast(true);
      
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      
      setToastType('danger');
      setToastMessage(errorMsg);
      setShowToast(true);
      
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
    <div 
      className="container-fluid" 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <div 
        className="row justify-content-center align-items-center" 
        style={{ 
          minHeight: '100vh',
          padding: '20px 0'
        }}
      >
        <div 
          className="col-md-5 col-lg-4"
          style={{
            animation: 'fadeInUp 0.5s ease-out'
          }}
        >
          <div 
            className="card shadow-lg border-0"
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <div 
              className="card-header text-center py-4"
              style={{
                background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                color: 'white',
                borderBottom: 'none',
                boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
              }}
            >
              <h3 
                className="mb-0 fw-bold"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}
              >
                <UserPlus className="me-2" size={28} style={{ color: 'rgba(255,255,255,0.9)' }} />
                Create Account
              </h3>
              <p 
                className="mb-0"
                style={{
                  opacity: 0.9,
                  fontSize: '0.95rem',
                  fontWeight: '300'
                }}
              >
                Join our community today
              </p>
            </div>
            
            <div 
              className="card-body p-4 p-md-5"
              style={{
                backgroundColor: 'white'
              }}
            >
              <form onSubmit={handleRegister}>
                <div 
                  className="mb-3"
                  style={{
                    marginBottom: '1.25rem'
                  }}
                >
                  <label 
                    htmlFor="username" 
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057',
                      fontSize: '0.95rem'
                    }}
                  >
                    Username
                  </label>
                  <div 
                    className="input-group"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'stretch',
                      width: '100%'
                    }}
                  >
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRight: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '8px 0 0 8px',
                        transition: 'border-color 0.15s ease-in-out'
                      }}
                    >
                      <User size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        borderRadius: '0 8px 8px 0',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        ':focus': {
                          borderColor: '#86b7fe',
                          boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                          outline: '0',
                          zIndex: '3'
                        }
                      }}
                    />
                    {errors.username && (
                      <div 
                        className="invalid-feedback"
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '0.25rem',
                          fontSize: '0.875em',
                          color: '#dc3545'
                        }}
                      >
                        {errors.username}
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className="mb-3"
                  style={{
                    marginBottom: '1.25rem'
                  }}
                >
                  <label 
                    htmlFor="email" 
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057',
                      fontSize: '0.95rem'
                    }}
                  >
                    Email Address
                  </label>
                  <div 
                    className="input-group"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'stretch',
                      width: '100%'
                    }}
                  >
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRight: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '8px 0 0 8px'
                      }}
                    >
                      <Mail size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        borderRadius: '0 8px 8px 0',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        ':focus': {
                          borderColor: '#86b7fe',
                          boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                          outline: '0'
                        }
                      }}
                    />
                    {errors.email && (
                      <div 
                        className="invalid-feedback"
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '0.25rem',
                          fontSize: '0.875em',
                          color: '#dc3545'
                        }}
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className="mb-3"
                  style={{
                    marginBottom: '1.25rem'
                  }}
                >
                  <label 
                    htmlFor="password" 
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057',
                      fontSize: '0.95rem'
                    }}
                  >
                    Password
                  </label>
                  <div 
                    className="input-group"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'stretch',
                      width: '100%',
                      marginBottom: '0.25rem'
                    }}
                  >
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRight: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '8px 0 0 8px'
                      }}
                    >
                      <Lock size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        ':focus': {
                          borderColor: '#86b7fe',
                          boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                          outline: '0'
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="input-group-text"
                      onClick={() => togglePasswordVisibility('password')}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderLeft: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '0 8px 8px 0',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease-in-out',
                        ':hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      {showPassword ? 
                        <EyeOff size={18} style={{ color: '#6c757d' }} /> : 
                        <Eye size={18} style={{ color: '#6c757d' }} />
                      }
                    </button>
                    {errors.password && (
                      <div 
                        className="invalid-feedback"
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '0.25rem',
                          fontSize: '0.875em',
                          color: '#dc3545'
                        }}
                      >
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <small 
                    className="form-text text-muted"
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      fontSize: '0.875em',
                      color: '#6c757d'
                    }}
                  >
                    Use at least 6 characters
                  </small>
                </div>
                
                <div 
                  className="mb-4"
                  style={{
                    marginBottom: '1.5rem'
                  }}
                >
                  <label 
                    htmlFor="confirmPassword" 
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057',
                      fontSize: '0.95rem'
                    }}
                  >
                    Confirm Password
                  </label>
                  <div 
                    className="input-group"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'stretch',
                      width: '100%'
                    }}
                  >
                    <span 
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRight: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '8px 0 0 8px'
                      }}
                    >
                      <CheckCircle size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.5rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        ':focus': {
                          borderColor: '#86b7fe',
                          boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                          outline: '0'
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      className="input-group-text"
                      onClick={() => togglePasswordVisibility('confirm')}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderLeft: 'none',
                        padding: '0.5rem 0.75rem',
                        color: '#495057',
                        borderRadius: '0 8px 8px 0',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease-in-out',
                        ':hover': {
                          backgroundColor: '#f8f9fa'
                        }
                      }}
                    >
                      {showConfirmPassword ? 
                        <EyeOff size={18} style={{ color: '#6c757d' }} /> : 
                        <Eye size={18} style={{ color: '#6c757d' }} />
                      }
                    </button>
                    {errors.confirmPassword && (
                      <div 
                        className="invalid-feedback"
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '0.25rem',
                          fontSize: '0.875em',
                          color: '#dc3545'
                        }}
                      >
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div 
                  className="d-grid"
                  style={{
                    display: 'grid',
                    gap: '1rem'
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{
                      display: 'inline-block',
                      fontWeight: '600',
                      lineHeight: '1.5',
                      color: '#fff',
                      textAlign: 'center',
                      textDecoration: 'none',
                      verticalAlign: 'middle',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: '#3f51b5',
                      border: '1px solid #3f51b5',
                      padding: '0.75rem 1.5rem',
                      fontSize: '1.1rem',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      ':hover': {
                        backgroundColor: '#3949ab',
                        borderColor: '#3949ab',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
                      },
                      ':disabled': {
                        opacity: '0.7',
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span 
                          className="spinner-border spinner-border-sm me-2" 
                          role="status" 
                          aria-hidden="true"
                          style={{
                            display: 'inline-block',
                            width: '1rem',
                            height: '1rem',
                            verticalAlign: 'text-bottom',
                            border: '0.2em solid currentColor',
                            borderRightColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spinner-border 0.75s linear infinite',
                            marginRight: '0.5rem'
                          }}
                        ></span>
                        Registering...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
            
            <div 
              className="card-footer text-center py-3"
              style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid rgba(0,0,0,.075)',
                textAlign: 'center'
              }}
            >
              <div 
                className="text-muted"
                style={{
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}
              >
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-decoration-none fw-semibold"
                  style={{
                    color: '#3f51b5',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.2s ease',
                    ':hover': {
                      color: '#303f9f',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
          
          <div 
            className="text-center mt-4"
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '0.85rem'
            }}
          >
            <p 
              className="text-muted"
              style={{
                marginBottom: '0.25rem'
              }}
            >
              By signing up, you agree to our{' '}
              <a 
                href="#" 
                className="text-decoration-none"
                style={{
                  color: '#3f51b5',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  ':hover': {
                    color: '#303f9f',
                    textDecoration: 'underline'
                  }
                }}
              >
                Terms
              </a>{' '}
              and{' '}
              <a 
                href="#" 
                className="text-decoration-none"
                style={{
                  color: '#3f51b5',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  ':hover': {
                    color: '#303f9f',
                    textDecoration: 'underline'
                  }
                }}
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Toast notification */}
      <div 
        className="position-fixed bottom-0 end-0 p-3" 
        style={{ 
          position: 'fixed',
          bottom: '0',
          right: '0',
          padding: '1rem',
          zIndex: '11'
        }}
      >
        <div 
          className={`toast ${showToast ? 'show' : 'hide'} text-white`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          style={{
            width: '350px',
            maxWidth: '100%',
            fontSize: '0.875rem',
            backgroundColor: toastType === 'success' ? '#4caf50' : '#f44336',
            backgroundClip: 'padding-box',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            opacity: showToast ? '1' : '0',
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            pointerEvents: showToast ? 'auto' : 'none',
            transform: showToast ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div 
            className="d-flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem'
            }}
          >
            <div 
              className="toast-body d-flex align-items-center"
              style={{
                flex: '1',
                padding: '0',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {toastType === 'success' ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  fill="currentColor" 
                  className="me-2" 
                  viewBox="0 0 16 16"
                  style={{
                    flexShrink: '0'
                  }}
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              ) : (
                <AlertCircle 
                  className="me-2" 
                  size={20} 
                  style={{
                    flexShrink: '0'
                  }}
                />
              )}
              <span style={{ lineHeight: '1.4' }}>{toastMessage}</span>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => setShowToast(false)}
              style={{
                boxSizing: 'content-box',
                width: '1em',
                height: '1em',
                padding: '0.25em 0.25em',
                color: '#fff',
                background: 'transparent url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'%23fff\'%3e%3cpath d=\'M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z\'/%3e%3c/svg%3e") center/1em auto no-repeat',
                border: '0',
                borderRadius: '0.25rem',
                opacity: '0.8',
                transition: 'opacity 0.15s ease-in-out',
                ':hover': {
                  opacity: '1'
                }
              }}
            ></button>
          </div>
        </div>
      </div>
      
      {/* Background animation */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ 
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          zIndex: '-1',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <div 
          className="position-absolute" 
          style={{ 
            position: 'absolute',
            top: '25%', 
            right: '15%', 
            width: '300px', 
            height: '300px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(63, 81, 181, 0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'float 6s ease-in-out infinite',
            filter: 'blur(8px)'
          }}
        ></div>
        <div 
          className="position-absolute" 
          style={{ 
            position: 'absolute',
            bottom: '20%', 
            left: '10%', 
            width: '400px', 
            height: '400px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'float 8s ease-in-out infinite 2s',
            filter: 'blur(8px)'
          }}
        ></div>
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          
          @keyframes spinner-border {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;