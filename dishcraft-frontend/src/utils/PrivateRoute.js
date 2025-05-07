import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('ADMIN');
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};