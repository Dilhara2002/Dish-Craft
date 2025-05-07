import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/admin/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/users/${userId}/promote`);
      setUsers(users.map(u => u.id === userId ? { ...u, roles: [...u.roles, 'ADMIN'] } : u));
    } catch (error) {
      console.error('Promotion failed:', error);
    }
  };

  const handleDemote = async (userId) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/users/${userId}/demote`);
      setUsers(users.map(u => u.id === userId ? { ...u, roles: u.roles.filter(r => r !== 'ADMIN') } : u));
    } catch (error) {
      console.error('Demotion failed:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(', ')}</td>
              <td className="actions">
                {!user.roles.includes('ADMIN') ? (
                  <button onClick={() => handlePromote(user.id)}>Promote to Admin</button>
                ) : (
                  <button onClick={() => handleDemote(user.id)}>Demote from Admin</button>
                )}
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;