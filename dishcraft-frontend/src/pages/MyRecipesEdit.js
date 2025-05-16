import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyRecipesEdit = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    imageUrl: '',
    tags: ''
  });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:8080/api/recipes/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMyRecipes(res.data))
      .catch(err => console.error('Error fetching recipes:', err));
  }, [userId, token]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios.delete(`http://localhost:8080/api/recipes/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          userId: userId  // Add userId header here
        }
      })
        .then(() => {
          setMyRecipes(myRecipes.filter(recipe => recipe.id !== id));
        })
        .catch(err => console.error('Delete error:', err));
    }
  };

  const openEditModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients?.join(', ') || '',
      steps: recipe.instructions?.join('. ') || '',
      imageUrl: recipe.imageUrl || '',
      tags: recipe.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const updatedPayload = {
      title: editForm.title,
      description: editForm.description,
      ingredients: editForm.ingredients.split(',').map(i => i.trim()),
      instructions: editForm.steps.split('.').map(s => s.trim()).filter(s => s),
      imageUrl: editForm.imageUrl,
      tags: editForm.tags ? editForm.tags.split(',').map(t => t.trim()) : []
    };

    axios.put(`http://localhost:8080/api/recipes/${selectedRecipe.id}`, updatedPayload, {
      headers: { 
        Authorization: `Bearer ${token}`,
        userId: userId  // Add userId header here too
      }
    })
      .then(res => {
        setMyRecipes(myRecipes.map(r => r.id === selectedRecipe.id ? res.data : r));
        setShowModal(false);
      })
      .catch(err => console.error('Update error:', err));
  };

  return (
    <div className="container mt-4">
      <h2>My Recipes</h2>
      <Link to="/add" className="btn btn-success mb-3">Add New Recipe</Link>

      <div className="row">
        {myRecipes.length === 0 && <p>No recipes found.</p>}
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
                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(recipe)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(recipe.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Recipe</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {['title', 'description', 'ingredients', 'steps', 'imageUrl', 'tags'].map((field, index) => (
                  <div className="form-group mb-3" key={index}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {field === 'description' || field === 'steps' ? (
                      <textarea
                        className="form-control"
                        name={field}
                        value={editForm[field]}
                        onChange={handleChange}
                        rows="3"
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name={field}
                        value={editForm[field]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button onClick={handleUpdate} className="btn btn-primary">Update</button>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipesEdit;
