import React, { useState } from 'react';
import API from '../api/axios';

const UserSearch = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const res = await API.get(`/users/email/${email}`);
      setUser(res.data);
      setError('');
    } catch (err) {
      setUser(null);
      setError('User not found');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Find User by Email</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter email"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {user && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
