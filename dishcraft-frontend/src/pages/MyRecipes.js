import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // JWT token
    const userId = localStorage.getItem('userId'); // Store userId during login

    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    axios.get(`http://localhost:8080/api/recipes/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMyRecipes(res.data))
    .catch(err => console.error('Error fetching user recipes:', err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Recipes</h2>
      <Link to="/add" className="btn btn-success mb-3">Add New Recipe</Link>

      <div className="row">
        {myRecipes.length === 0 && <p>You haven't added any recipes yet.</p>}

        {myRecipes.map((recipe, index) => (
          <div key={recipe.id || index} className="col-md-4 mb-3">
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
                <Link to={`/MyRecipes/${recipe.id}`} className="btn btn-sm btn-outline-primary">
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

export default MyRecipes;
