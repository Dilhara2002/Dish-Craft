import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


function UserProfile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email,
          profileImage: data.profileImage || ''
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    if (user) fetchProfile();
  }, [user, token]);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(data);
      setEditMode(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      {profile && (
        <div className="profile-content">
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Profile Image URL:</label>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-view">
              {profile.profileImage && (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  className="profile-image"
                />
              )}
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;