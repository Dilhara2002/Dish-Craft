import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children }) {
  const { jwt } = useAuth();
  return jwt ? children : <Navigate to="/login" />;
}
