import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipe details.');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId
        }
      });
      window.location.href = '/recipes';
    } catch (err) {
      setError('Failed to delete recipe.');
    }
  };

  if (loading) {
    return <p>Loading recipe details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>{recipe.title}</h2>
      
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} style={mainImageStyle} />
      )}
      
      <p style={descriptionStyle}>{recipe.description}</p>
      
      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>Ingredients</h3>
        <ul style={ingredientListStyle}>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} style={ingredientItemStyle}>{ingredient}</li>
          ))}
        </ul>
      </div>
      
      <div style={sectionStyle}>
        <h3 style={sectionHeadingStyle}>Instructions</h3>
        <ol style={instructionListStyle}>
          {recipe.instructions.map((instruction, index) => (
            <li key={index} style={instructionItemStyle}>{instruction}</li>
          ))}
        </ol>
      </div>
      
      {recipe.tags && recipe.tags.length > 0 && (
        <div style={tagContainerStyle}>
          {recipe.tags.map((tag, index) => (
            <span key={index} style={tagStyle}>{tag}</span>
          ))}
        </div>
      )}
      
      {recipe.userId === userId && (
        <div style={buttonContainerStyle}>
          <Link to={`/recipes/edit/${recipe.id}`} style={editButtonStyle}>
            Edit Recipe
          </Link>
          <button onClick={handleDelete} style={deleteButtonStyle}>
            Delete Recipe
          </button>
        </div>
      )}
      
      <Link to="/recipes" style={backButtonStyle}>
        Back to Recipes
      </Link>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
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

const mainImageStyle = {
  width: '100%',
  maxHeight: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '20px',
};

const descriptionStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  marginBottom: '30px',
};

const sectionStyle = {
  marginBottom: '30px',
};

const sectionHeadingStyle = {
  borderBottom: '2px solid #ddd',
  paddingBottom: '5px',
  color: '#444',
};

const ingredientListStyle = {
  listStyleType: 'none',
  padding: 0,
};

const ingredientItemStyle = {
  padding: '8px 0',
  borderBottom: '1px solid #eee',
};

const instructionListStyle = {
  paddingLeft: '20px',
};

const instructionItemStyle = {
  padding: '8px 0',
};

const tagContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginBottom: '30px',
};

const tagStyle = {
  backgroundColor: '#e0e0e0',
  padding: '5px 10px',
  borderRadius: '20px',
  fontSize: '0.9rem',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '20px',
};

const editButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  textDecoration: 'none',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const backButtonStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '10px',
  color: '#6c757d',
  textDecoration: 'none',
};

export default RecipeDetail;