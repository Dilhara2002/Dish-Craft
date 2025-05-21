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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

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

      setModalType('success');
      setModalMessage('Login successful! Redirecting to your recipes...');
      setShowModal(true);

      setTimeout(() => {
        navigate('/recipes');
      }, 2000);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);

      setModalType('danger');
      setModalMessage(errorMsg);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container-fluid bg-light"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
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
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <div
            className="card shadow-lg border-0 rounded-lg"
            style={{
              border: 'none',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <div
              className="card-header text-center py-4"
              style={{
                background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                color: 'white',
                borderBottom: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <h3
                className="mb-0 fw-bold"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  letterSpacing: '0.5px'
                }}
              >
                <LogIn className="me-2" size={24} />
                Sign In
              </h3>
              <p
                className="mb-0"
                style={{
                  opacity: 0.8,
                  fontSize: '0.9rem',
                  marginTop: '8px'
                }}
              >
                Access your account
              </p>
            </div>

            <div
              className="card-body p-4 p-md-5"
              style={{
                backgroundColor: 'white'
              }}
            >
              <form onSubmit={handleSubmit}>
                <div
                  className="mb-4"
                  style={{
                    marginBottom: '1.5rem'
                  }}
                >
                  <label
                    htmlFor="email-address"
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057'
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
                        padding: '0.375rem 0.75rem',
                        color: '#495057',
                        borderRadius: '0.25rem 0 0 0.25rem'
                      }}
                    >
                      <Mail size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        borderRadius: '0 0.25rem 0.25rem 0',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        ':focus': {
                          borderColor: '#86b7fe',
                          boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                          outline: '0'
                        }
                      }}
                    />
                  </div>
                </div>

                <div
                  className="mb-4"
                  style={{
                    marginBottom: '1.5rem'
                  }}
                >
                  <label
                    htmlFor="password"
                    className="form-label"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#495057'
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
                      width: '100%'
                    }}
                  >
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #ced4da',
                        borderRight: 'none',
                        padding: '0.375rem 0.75rem',
                        color: '#495057',
                        borderRadius: '0.25rem 0 0 0.25rem'
                      }}
                    >
                      <Lock size={18} style={{ color: '#6c757d' }} />
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
                      style={{
                        position: 'relative',
                        flex: '1 1 auto',
                        width: '1%',
                        minWidth: '0',
                        padding: '0.375rem 0.75rem',
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
                      className="input-group-text bg-white"
                      onClick={togglePasswordVisibility}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderLeft: 'none',
                        padding: '0.375rem 0.75rem',
                        color: '#495057',
                        borderRadius: '0 0.25rem 0.25rem 0',
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
                  </div>
                </div>
                {/* Success/Error Modal */}
                {showModal && (
                  <div className="modal fade show" style={{
                    display: 'block',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1050
                  }}>
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className={`modal-header ${modalType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                          <h5 className="modal-title">
                            {modalType === 'success' ? 'Success!' : 'Error!'}
                          </h5>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={handleCloseModal}
                          ></button>
                        </div>
                        <div className="modal-body text-center py-4">
                          <div className="mb-3">
                            {modalType === 'success' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#28a745" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#dc3545" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                            )}
                          </div>
                          <h4 className="mb-3">{modalMessage}</h4>
                          {modalType === 'success' && (
                            <div className="spinner-border text-primary mt-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          )}
                        </div>
                        <div className="modal-footer justify-content-center">
                          <button
                            type="button"
                            className={`btn ${modalType === 'success' ? 'btn-success' : 'btn-danger'}`}
                            onClick={handleCloseModal}
                          >
                            {modalType === 'success' ? 'Continue' : 'Try Again'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="d-flex justify-content-between align-items-center mb-4"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <div
                    className="form-check"
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember-me"
                      style={{
                        width: '1em',
                        height: '1em',
                        marginTop: '0.25em',
                        verticalAlign: 'top',
                        backgroundColor: '#fff',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        border: '1px solid rgba(0,0,0,.25)',
                        appearance: 'none',
                        colorAdjust: 'exact',
                        marginRight: '0.5rem',
                        ':checked': {
                          backgroundColor: '#0d6efd',
                          borderColor: '#0d6efd'
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="remember-me"
                      style={{
                        userSelect: 'none',
                        color: '#495057',
                        fontSize: '0.875rem'
                      }}
                    >
                      Remember me
                    </label>
                  </div>

                  <a
                    href="#"
                    className="text-decoration-none"
                    style={{
                      color: '#0d6efd',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      transition: 'color 0.15s ease-in-out',
                      ':hover': {
                        color: '#0a58ca',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center mb-4"
                    role="alert"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1.25rem',
                      marginBottom: '1rem',
                      border: '1px solid transparent',
                      borderRadius: '0.25rem',
                      color: '#842029',
                      backgroundColor: '#f8d7da',
                      borderColor: '#f5c2c7'
                    }}
                  >
                    <AlertCircle className="me-2" size={18} />
                    <div>{error}</div>
                  </div>
                )}

                <div
                  className="d-grid"
                  style={{
                    display: 'grid'
                  }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{
                      display: 'inline-block',
                      fontWeight: '400',
                      lineHeight: '1.5',
                      color: '#fff',
                      textAlign: 'center',
                      textDecoration: 'none',
                      verticalAlign: 'middle',
                      cursor: 'pointer',
                      userSelect: 'none',
                      backgroundColor: '#0d6efd',
                      border: '1px solid #0d6efd',
                      padding: '0.5rem 1rem',
                      fontSize: '1.25rem',
                      borderRadius: '0.3rem',
                      transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                      ':hover': {
                        backgroundColor: '#0b5ed7',
                        borderColor: '#0a58ca'
                      },
                      ':disabled': {
                        opacity: '0.65',
                        pointerEvents: 'none'
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
                            border: '0.25em solid currentColor',
                            borderRightColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spinner-border 0.75s linear infinite'
                          }}
                        ></span>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </div>
              </form>
            </div>

            <div
              className="card-footer text-center py-3 bg-light"
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid rgba(0,0,0,.125)',
                textAlign: 'center'
              }}
            >
              <div
                className="text-muted"
                style={{
                  color: '#6c757d',
                  fontSize: '0.875rem'
                }}
              >
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-decoration-none fw-semibold"
                  style={{
                    color: '#0d6efd',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.15s ease-in-out',
                    ':hover': {
                      color: '#0a58ca',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>

          <div
            className="text-center mt-4"
            style={{
              marginTop: '1.5rem',
              textAlign: 'center'
            }}
          >
            <p
              className="text-muted"
              style={{
                color: '#6c757d',
                fontSize: '0.875rem'
              }}
            >
              &copy; {new Date().getFullYear()} Dish-Craft. All rights reserved.
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
            backgroundColor: toastType === 'success' ? '#198754' : '#dc3545',
            backgroundClip: 'padding-box',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '0.25rem',
            boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
            opacity: showToast ? '1' : '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: showToast ? 'auto' : 'none'
          }}
        >
          <div
            className="d-flex"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem'
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
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="me-2"
                  viewBox="0 0 16 16"
                  style={{
                    flexShrink: '0'
                  }}
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
              ) : (
                <AlertCircle
                  className="me-2"
                  size={16}
                  style={{
                    flexShrink: '0'
                  }}
                />
              )}
              <span>{toastMessage}</span>
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
                opacity: '0.5',
                transition: 'opacity 0.15s ease-in-out',
                ':hover': {
                  opacity: '0.75'
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
            top: '15%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(63, 81, 181, 0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}
        ></div>
        <div
          className="position-absolute"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,135,84,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'float 8s ease-in-out infinite 2s'
          }}
        ></div>
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes spinner-border {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;