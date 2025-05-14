// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetailPage from './pages/RecipeListPage';
import RecipeCreatePage from './pages/RecipeCreatePage';
import UserRecipesPage from './pages/RecipeCard';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/my-recipes" element={<PrivateRoute><UserRecipesPage /></PrivateRoute>} />
          <Route path="/create-recipe" element={<PrivateRoute><RecipeCreatePage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;