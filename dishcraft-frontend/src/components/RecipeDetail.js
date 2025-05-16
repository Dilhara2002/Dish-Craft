import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipe details');
        setLoading(false);
        console.error('Error fetching recipe:', err);
      }
    };
    
    fetchRecipe();
  }, [id, token]);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Recipe deleted successfully!');
        navigate('/recipes');
      } catch (err) {
        alert('Failed to delete recipe');
        console.error('Error deleting recipe:', err);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Recipe not found'}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{recipe.title}</h3>
          <div>
            <button 
              className="btn btn-sm btn-light me-2"
              onClick={() => navigate('/recipes')}
            >
              <i className="bi bi-arrow-left me-1"></i>Back
            </button>
            <button 
              className="btn btn-sm btn-warning me-2"
              onClick={() => navigate(`/recipes/edit/${id}`)}
            >
              <i className="bi bi-pencil me-1"></i>Edit
            </button>
            <button 
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
        
        {recipe.imageUrl && (
          <img 
            src={recipe.imageUrl} 
            className="card-img-top" 
            alt={recipe.title}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        )}
        
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3 col-sm-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-clock fs-4 me-2 text-primary"></i>
                <div>
                  <small className="text-muted">Prep Time</small>
                  <p className="mb-0 fw-bold">{recipe.prepTime || 'N/A'} mins</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-hourglass-split fs-4 me-2 text-primary"></i>
                <div>
                  <small className="text-muted">Cook Time</small>
                  <p className="mb-0 fw-bold">{recipe.cookingTime || 'N/A'} mins</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-people fs-4 me-2 text-primary"></i>
                <div>
                  <small className="text-muted">Servings</small>
                  <p className="mb-0 fw-bold">{recipe.servings || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-tag fs-4 me-2 text-primary"></i>
                <div>
                  <small className="text-muted">Category</small>
                  <p className="mb-0 fw-bold">{recipe.category || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4>Description</h4>
            <p>{recipe.description}</p>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Ingredients</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                      <li className="list-group-item" key={index}>
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Instructions</h5>
                </div>
                <div className="card-body">
                  <ol className="list-group list-group-numbered">
                    {recipe.instructions && recipe.instructions.map((step, index) => (
                      <li className="list-group-item d-flex" key={index}>
                        <div className="ms-2 me-auto">
                          <div>{step}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          {recipe.notes && (
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Notes</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{recipe.notes}</p>
              </div>
            </div>
          )}
          
          <div className="text-muted mt-3">
            <small>
              <i className="bi bi-calendar3 me-1"></i>
              Created: {new Date(recipe.createdAt).toLocaleDateString()}
              {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && (
                <>
                  <i className="bi bi-pencil ms-3 me-1"></i>
                  Updated: {new Date(recipe.updatedAt).toLocaleDateString()}
                </>
              )}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;