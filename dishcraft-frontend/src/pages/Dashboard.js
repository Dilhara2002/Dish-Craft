import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
      <div className="dashboard-buttons">
        <button onClick={() => navigate('/profile')}>View Profile</button>
        {user?.roles?.includes('ADMIN') && (
          <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;