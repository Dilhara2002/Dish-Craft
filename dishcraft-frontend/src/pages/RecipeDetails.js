import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8080/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      
      }
    })
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="container mt-4">
      <h2>{recipe.title}</h2>
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} style={{ maxWidth: '400px' }} />
      )}
      <p>{recipe.description}</p>

      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
          <li key={idx}>{ingredient}</li>
        ))}
      </ul>

      <h4>Steps:</h4>
      <ol>
        {recipe.steps && recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      <Link to="/recipes" className="btn btn-secondary mt-3">Back to All Recipes</Link>
    </div>
  );
};

export default RecipeDetails;
