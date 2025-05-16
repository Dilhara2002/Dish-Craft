import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Home from './components/Home';
import Profile from './pages/Profile'; // Uncomment if you have a Profile page


// Uncomment if you have a RecipeDetail page
import Navbar from './components/Navbar';          // For Login & Register pages
import UserNavbar from './components/UserNavbar';  // For Home page
import AdminNavbar from './components/AdminNavbar';

// For Admin page
import AdminDashboard from './pages/AdminDashboard.js';

// Uncomment if you have a RecipeDetail page

import RecipeDetails from './pages/RecipeDetails.js';
import AllRecipes from './pages/AllRecipes.js'; // Uncomment if you have an AllRecipes page
import AddRecipe from './pages/AddRecipe.js';
import MyRecipes from './pages/MyRecipes.js';
import MyRecipesEdit from './pages/MyRecipesEdit.js';// For editing recipes


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

        {/* Uncomment if you have a RecipeDetail page */}
        <Route path="/my-recipes" element={<MyRecipes />} /> {/* Uncomment if you have a MyRecipes page */}
        <Route path="/recipes" element={<AllRecipes />} /> {/* Uncomment if you have a RecipeList page */}
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/MyRecipes" element={<MyRecipesEdit />} />


        
        {/* Uncomment if you have a RecipeDetails page */}

       
        <Route path="/recipes/:id" element={<RecipeDetails />} />

        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Add more routes as needed */}
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
