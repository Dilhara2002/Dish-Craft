import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle, LogOut, Camera, Edit3, Save, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        
        // Check if user has admin role
        if (res.data.roles && res.data.roles.includes('ADMIN')) {
          setIsAdmin(true);
        }
        
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

  const navigateToAdminPanel = () => {
    navigate('/admin');
  };

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4 mx-auto">
          <div className="card shadow">
            <div className="bg-primary text-white p-5 text-center rounded-top position-relative">
              <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                {isAdmin && (
                  <button 
                    onClick={navigateToAdminPanel}
                    className="btn btn-light btn-sm"
                    title="Admin Panel"
                  >
                    <Settings className="me-1" size={16} /> Admin
                  </button>
                )}
                <button 
                  onClick={handleLogout} 
                  className="btn btn-light btn-sm"
                  title="Logout"
                >
                  <LogOut className="me-1" size={16} /> Logout
                </button>
              </div>
              
              <div className="position-relative d-inline-block mb-3">
                <div className="avatar-upload position-relative">
                  <div className="avatar-preview rounded-circle border border-4 border-white overflow-hidden" style={{ width: '150px', height: '150px' }}>
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center bg-secondary w-100 h-100">
                        <UserCircle size={80} />
                      </div>
                    )}
                  </div>
                  
                  {edit && (
                    <div className="avatar-edit position-absolute bottom-0 end-0">
                      <label 
                        htmlFor="imageUpload" 
                        className="btn btn-sm btn-light rounded-circle p-2"
                        title="Change profile picture"
                      >
                        <Camera size={16} />
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
              
              <h3 className="mb-0">
                {profile?.firstName} {profile?.lastName}
              </h3>
              <p className="text-light mb-0">@{profile?.username}</p>
            </div>
            
            <div className="card-body p-4">
              {!edit ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Profile Information</h5>
                    <button 
                      onClick={() => setEdit(true)} 
                      className="btn btn-outline-primary btn-sm"
                    >
                      <Edit3 size={16} className="me-1" /> Edit Profile
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Username:</strong></p>
                    <p className="text-muted">{profile?.username}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>First Name:</strong></p>
                    <p className="text-muted">{profile?.firstName}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Last Name:</strong></p>
                    <p className="text-muted">{profile?.lastName}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>Roles:</strong></p>
                    <p className="text-muted">{profile?.roles?.join(', ') || 'User'}</p>
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="firstName" 
                      name="firstName" 
                      value={profile?.firstName || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="lastName" 
                      name="lastName" 
                      value={profile?.lastName || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success">
                      <Save size={16} className="me-1" /> Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={() => {
                        setEdit(false);
                        setImagePreview(profile?.profileImage || null);
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