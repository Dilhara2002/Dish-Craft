import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Assuming you have this
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; // Optional for admin routes

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import RecipeFormPage from './pages/RecipeFormPage';


// Navbars
import Navbar from './components/Navbar';
import UserNavbar from './components/UserNavbar';
import AdminNavbar from './components/AdminNavbar';

function AppContent() {
  const location = useLocation();
  const { user } = useAuth(); // Assuming you have useAuth hook

  const renderNavbar = () => {
    const path = location.pathname.toLowerCase();
    
    if (user?.role === 'admin') {
      return <AdminNavbar />;
    } else if (user) {
      return <UserNavbar />;
    } else if (path === '/login' || path === '/register') {
      return <Navbar />;
    }
    // No navbar for other unauthenticated pages
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {renderNavbar()}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        
        {/* Recipe viewing routes (public) */}
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        
        {/* Authenticated user routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipes/new" element={<RecipeFormPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
        </Route>
        
        {/* Admin-only routes (example) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap with your auth provider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;