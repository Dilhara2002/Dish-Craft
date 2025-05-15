import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Home from './components/Home';
import Profile from './pages/Profile'; // Uncomment if you have a Profile page

import Navbar from './components/Navbar';          // For Login & Register pages
import UserNavbar from './components/UserNavbar';  // For Home page
import AdminNavbar from './components/AdminNavbar';
import RecipeList from './pages/RecipeList.js'; // Uncomment if you have a RecipeList page
import RecipeForm from './components/RecipeForm.js'; // Uncomment if you have a RecipeForm page
import RecipeDetail from './components/RecipeDetail.js'; // Uncomment if you have a RecipeDetail page


// Handles routing + navbar logic
function AppContent() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const renderNavbar = () => {
    if (path === '/home') {
      return <UserNavbar />;
    } else if (path === '/login' || path === '/register') {
      return <Navbar />;
    } else {
      return <AdminNavbar />; // Optional: Add a default navbar or keep it blank
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      {renderNavbar()}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> {/* Uncomment if you have a Profile page */}
        <Route path="/recipes" element={<RecipeList />} /> {/* Uncomment if you have a RecipeList page */}
        <Route path="/recipes/new" element={<RecipeForm />} /> {/* Uncomment if you have a RecipeForm page */}
        <Route path="/recipes/:id" element={<RecipeForm />} /> {/* Uncomment if you have a RecipeForm page */}
        {/* Add more routes if needed */}
      </Routes>
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
