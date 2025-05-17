import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle, LogOut, Camera, Edit3, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        if (res.data.profileImage) {
          setImagePreview(res.data.profileImage);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchProfile();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:8080/api/users/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEdit(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  const isAdmin = profile?.roles?.includes('ROLE_ADMIN');

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div className="row">
        <div className="col-lg-6 col-md-8 col-sm-10 mx-auto">
          <div className="card shadow-lg" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'translateY(-5px)'
            }
          }}>
            <div className="text-white p-5 text-center rounded-top position-relative" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              paddingBottom: '80px'
            }}>
              <button
                onClick={handleLogout}
                className="btn btn-light btn-sm position-absolute top-0 end-0 m-3"
                title="Logout"
                style={{
                  borderRadius: '20px',
                  padding: '5px 15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut className="me-1" size={16} /> Logout
              </button>

              <div className="position-relative d-inline-block mb-3" style={{
                marginTop: '20px'
              }}>
                <div className="avatar-upload position-relative">
                  <div className="avatar-preview rounded-circle border border-4 border-white overflow-hidden" style={{ 
                    width: '150px', 
                    height: '150px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                  }}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-100 h-100 object-fit-cover"
                        style={{
                          transition: 'transform 0.3s ease',
                          ':hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center w-100 h-100" style={{
                        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
                      }}>
                        <UserCircle size={80} color="#ffffff" />
                      </div>
                    )}
                  </div>

                  {edit && (
                    <div className="avatar-edit position-absolute bottom-0 end-0">
                      <label
                        htmlFor="imageUpload"
                        className="btn btn-sm btn-light rounded-circle p-2"
                        title="Change profile picture"
                        style={{
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          ':hover': {
                            transform: 'scale(1.1)',
                            backgroundColor: '#f8f9fa'
                          }
                        }}
                      >
                        <Camera size={16} color="#333" />
                      </label>
                      <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="mb-0" style={{
                fontSize: '2rem',
                fontWeight: '600',
                textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                marginTop: '15px'
              }}>{profile?.firstName} {profile?.lastName}</h3>
              <p className="text-light mb-0" style={{
                fontSize: '1.1rem',
                opacity: '0.9',
                marginTop: '5px'
              }}>@{profile?.username}</p>

              {isAdmin && (
                <Link to="/admin" className="btn btn-warning mt-3" style={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  fontWeight: '500',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                  }
                }}>
                  Go to Admin Dashboard
                </Link>
              )}
            </div>

            <div className="card-body p-4" style={{
              background: '#ffffff',
              borderBottomLeftRadius: '15px',
              borderBottomRightRadius: '15px'
            }}>
              {!edit ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4" style={{
                    borderBottom: '1px solid #eee',
                    paddingBottom: '15px'
                  }}>
                    <h5 className="card-title" style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#333',
                      margin: '0'
                    }}>Profile Information</h5>
                    <button 
                      onClick={() => setEdit(true)} 
                      className="btn btn-outline-primary btn-sm"
                      style={{
                        borderRadius: '20px',
                        padding: '5px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Edit3 size={16} className="me-1" /> Edit Profile
                    </button>
                  </div>

                  <div className="mb-4" style={{
                    padding: '15px',
                    background: '#f9f9f9',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <p className="mb-1" style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#555'
                    }}><strong>Username:</strong></p>
                    <p className="text-muted" style={{
                      fontSize: '1rem',
                      margin: '0',
                      padding: '5px 0'
                    }}>{profile?.username}</p>
                  </div>

                  <div className="mb-4" style={{
                    padding: '15px',
                    background: '#f9f9f9',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <p className="mb-1" style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#555'
                    }}><strong>First Name:</strong></p>
                    <p className="text-muted" style={{
                      fontSize: '1rem',
                      margin: '0',
                      padding: '5px 0'
                    }}>{profile?.firstName}</p>
                  </div>

                  <div className="mb-4" style={{
                    padding: '15px',
                    background: '#f9f9f9',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <p className="mb-1" style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#555'
                    }}><strong>Last Name:</strong></p>
                    <p className="text-muted" style={{
                      fontSize: '1rem',
                      margin: '0',
                      padding: '5px 0'
                    }}>{profile?.lastName}</p>
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="mb-4">
                    <label htmlFor="firstName" className="form-label" style={{
                      fontWeight: '500',
                      color: '#555',
                      marginBottom: '8px'
                    }}>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={profile?.firstName || ''}
                      onChange={handleChange}
                      style={{
                        borderRadius: '10px',
                        padding: '10px 15px',
                        border: '1px solid #ddd',
                        ':focus': {
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 0.25rem rgba(102, 126, 234, 0.25)'
                        }
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="lastName" className="form-label" style={{
                      fontWeight: '500',
                      color: '#555',
                      marginBottom: '8px'
                    }}>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={profile?.lastName || ''}
                      onChange={handleChange}
                      style={{
                        borderRadius: '10px',
                        padding: '10px 15px',
                        border: '1px solid #ddd',
                        ':focus': {
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 0.25rem rgba(102, 126, 234, 0.25)'
                        }
                      }}
                    />
                  </div>

                  <div className="d-grid gap-3" style={{
                    marginTop: '30px'
                  }}>
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      style={{
                        borderRadius: '10px',
                        padding: '10px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Save size={16} className="me-2" /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEdit(false);
                        setImagePreview(profile?.profileImage || null);
                      }}
                      style={{
                        borderRadius: '10px',
                        padding: '10px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;