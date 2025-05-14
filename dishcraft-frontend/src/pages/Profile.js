import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // save this after login

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        alert('Failed to load profile');
      }
    };
    fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8080/api/users/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated');
      setProfile(res.data);
      setEdit(false);
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>User Profile</h2>
      {edit ? (
        <form onSubmit={handleUpdate}>
          <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" style={inputStyle} />
          <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" style={inputStyle} />
          <input name="profileImage" value={profile.profileImage || ''} onChange={handleChange} placeholder="Profile Image URL" style={inputStyle} />
          <button type="submit" style={saveBtn}>Save</button>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>First Name:</strong> {profile.firstName}</p>
          <p><strong>Last Name:</strong> {profile.lastName}</p>
          {profile.profileImage && <img src={profile.profileImage} alt="Profile" style={{ maxWidth: '100px' }} />}
          <button onClick={() => setEdit(true)} style={editBtn}>Edit</button>
        </div>
      )}
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', margin: '8px 0' };
const editBtn = { padding: '10px', marginTop: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' };
const saveBtn = { ...editBtn, background: '#28a745' };

export default Profile;
