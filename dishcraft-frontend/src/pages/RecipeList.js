import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipes(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipes.');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>My Recipes</h2>
      {recipes.length === 0 ? (
        <p>No recipes added yet.</p>
      ) : (
        <ul style={listStyle}>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={listItemStyle}>
              <Link to={`/recipes/${recipe.id}`} style={linkStyle}>
                {recipe.title}
              </Link>
              {recipe.imageUrl && (
                <img src={recipe.imageUrl} alt={recipe.title} style={imageStyle} />
              )}
            </li>
          ))}
        </ul>
      )}
      <Link to="/recipes/new" style={addButtonStyle}>
        Add New Recipe
      </Link>
    </div>
  );
};

const containerStyle = {
  maxWidth: '600px',
  margin: '30px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const headingStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #eee',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  fontSize: '1.1rem',
};

const imageStyle = {
  maxWidth: '80px',
  maxHeight: '80px',
  borderRadius: '4px',
  marginLeft: '10px',
};

const addButtonStyle = {
  display: 'block',
  padding: '10px 15px',
  marginTop: '20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center',
};

export default RecipeList;