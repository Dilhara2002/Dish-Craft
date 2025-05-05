import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-4 bg-white rounded shadow">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
