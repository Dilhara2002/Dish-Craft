import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css'; 
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profileImage: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userData = {
        id: decoded.jti || decoded.sub, // Using JTI or SUB as ID
        email: decoded.sub,
        username: decoded.username || decoded.sub.split('@')[0],
        roles: decoded.roles || ['ROLE_USER'],
        issuedAt: decoded.iat ? new Date(decoded.iat * 1000).toLocaleString() : 'Unknown',
        expiresAt: decoded.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'Unknown'
      };
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        password: '',
        profileImage: ''
      });
    } catch (err) {
      setError('Invalid token format. Please log in again.');
      console.error('Token decoding error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    
    // Use the user ID from token or state
    const userId = decoded.jti || user.id; // or another identifier
    
    const response = await axios.put(
      `http://localhost:8080/api/users/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // ... rest of the code
  } catch (err) {
    console.error('Update error:', err);
    alert(`Failed to update profile: ${err.response?.data?.message || err.message}`);
  }
};

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:8080/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        handleLogout();
        alert('Account deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete account');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading profile information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      
      {editMode ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Leave blank to keep current"
            />
          </div>
          <div className="form-group">
            <label>Profile Image URL:</label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleInputChange}
              placeholder="Enter image URL"
            />
          </div>
          <div className="form-actions">
            <button onClick={handleUpdate}>Save Changes</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Username:</span>
            <span className="detail-value">{user.username}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Account Type:</span>
            <span className="detail-value">
              {user.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'Standard User'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Session Started:</span>
            <span className="detail-value">{user.issuedAt}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Session Expires:</span>
            <span className="detail-value">{user.expiresAt}</span>
          </div>
          <div className="profile-actions">
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;