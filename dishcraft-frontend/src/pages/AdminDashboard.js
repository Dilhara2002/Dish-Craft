import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/admin/users/search?keyword=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to search users');
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Promote user to admin
  const promoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/users/${userId}/promote`, 
        null, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to promote user');
      console.error('Error promoting user:', err);
    }
  };

  // Demote admin to user
  const demoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/users/${userId}/demote`, 
        null, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to demote user');
      console.error('Error demoting user:', err);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8080/api/admin/users/${userId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>User Management</h1>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            flexGrow: 1,
            maxWidth: '400px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
        <button
          onClick={fetchUsers}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#d32f2f', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading users...</p>
        </div>
      ) : (
        /* Users Table */
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Roles</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '15px', textAlign: 'center' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px 15px' }}>{user.username}</td>
                    <td style={{ padding: '12px 15px' }}>{user.email}</td>
                    <td style={{ padding: '12px 15px' }}>
                      {user.roles.join(', ')}
                    </td>
                    <td style={{ padding: '12px 15px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {user.roles.includes('ADMIN') ? (
                          <button
                            onClick={() => demoteUser(user.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#ff9800',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Demote
                          </button>
                        ) : (
                          <button
                            onClick={() => promoteUser(user.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#2196F3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Promote
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;