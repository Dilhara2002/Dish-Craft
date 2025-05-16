import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch recipes');
      setLoading(false);
      console.error('Error fetching recipes:', err);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Remove the deleted recipe from the state
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        alert('Recipe deleted successfully!');
      } catch (err) {
        alert('Failed to delete recipe');
        console.error('Error deleting recipe:', err);
      }
    }
  };
  
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recipes</h2>
        <Link to="/recipes/add" className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>Add New Recipe
        </Link>
      </div>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredRecipes.length === 0 ? (
        <div className="alert alert-info">No recipes found</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredRecipes.map(recipe => (
            <div className="col" key={recipe.id}>
              <div className="card h-100">
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    className="card-img-top"
                    alt={recipe.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text">{recipe.description.substring(0, 100)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-info text-dark">
                      <i className="bi bi-clock me-1"></i>
                      {recipe.cookingTime} mins
                    </span>
                    <span className="badge bg-success">
                      <i className="bi bi-person me-1"></i>
                      {recipe.servings} servings
                    </span>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-between">
                    <Link to={`/recipes/${recipe.id}`} className="btn btn-sm btn-primary">
                      <i className="bi bi-eye me-1"></i>View
                    </Link>
                    <Link to={`/recipes/edit/${recipe.id}`} className="btn btn-sm btn-warning">
                      <i className="bi bi-pencil me-1"></i>Edit
                    </Link>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;