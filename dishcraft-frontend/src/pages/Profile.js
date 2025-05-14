import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Note the named import
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      // Decode token using the named import
      const decoded = jwtDecode(token);
      
      const userData = {
        email: decoded.sub,
        roles: decoded.roles || [],
        issuedAt: new Date(decoded.iat * 1000).toLocaleString(),
        expiresAt: new Date(decoded.exp * 1000).toLocaleString()
      };

      setUser(userData);
    } catch (err) {
      setError('Invalid token');
      console.error('Token decode error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {user.email}</p>
        {user.roles.length > 0 && (
          <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
        )}
        <p><strong>Token Issued:</strong> {user.issuedAt}</p>
        <p><strong>Token Expires:</strong> {user.expiresAt}</p>
      </div>
    </div>
  );
};

export default Profile;