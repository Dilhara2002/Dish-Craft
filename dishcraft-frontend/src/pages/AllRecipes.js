import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from localStorage

    axios.get('http://localhost:8080/api/recipes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setRecipes(res.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>All Recipes</h2>
      <Link to="/add" className="btn btn-primary mb-3">Add New Recipe</Link>

      <div className="row">
        {recipes.length === 0 && <p>No recipes found.</p>}

        {recipes.map((recipe, index) => (
          <div key={recipe._id || index} className="col-md-4 mb-3">
            <div className="card h-100">
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.description?.substring(0, 100)}...</p>
                <Link to={`/recipes/${recipe._id}`} className="btn btn-sm btn-outline-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRecipes;
