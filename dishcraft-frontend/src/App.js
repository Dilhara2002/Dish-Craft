import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Component imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import RecipeForm from './components/RecipeForm';

// Context imports
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b6b',
    },
    secondary: {
      main: '#4ecdc4',
    },
    background: {
      default: '#f7f7f7',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <div className="app-container">
              <Navbar />
              
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/recipes" element={<RecipeList />} />
                  <Route path="/recipes/:id" element={<RecipeDetail />} />
                  <Route path="/users/:userId" element={<ProfilePage />} />
                  
                  {/* Private Routes */}
                  <Route path="/create-recipe" element={
                    <PrivateRoute>
                      <RecipeForm />
                    </PrivateRoute>
                  } />
                  <Route path="/my-recipes" element={
                    <PrivateRoute>
                      <RecipeList userOnly />
                    </PrivateRoute>
                  } />
                  <Route path="/edit-recipe/:id" element={
                    <PrivateRoute>
                      <RecipeForm editMode />
                    </PrivateRoute>
                  } />
                  
                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;