import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

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
          userId: userId
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
        userId: userId
      }
    })
      .then(res => {
        setMyRecipes(myRecipes.map(r => r.id === selectedRecipe.id ? res.data : r));
        setShowModal(false);
      })
      .catch(err => console.error('Update error:', err));
  };

  return (
    <div className="container mt-4" style={{
      maxWidth: '1200px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(to bottom, #f9f9f9, #eef2f5)',
      minHeight: '100vh',
      padding: '30px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h2 style={{
          color: '#2c3e50',
          fontWeight: '600',
          fontSize: '2rem',
          margin: '0'
        }}>My Recipes</h2>
        <Link 
          to="/add" 
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#218838',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Add New Recipe
        </Link>
      </div>

      {myRecipes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          background: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h4 style={{ color: '#7f8c8d', marginBottom: '20px' }}>No recipes found</h4>
          <Link 
            to="/add" 
            className="btn btn-primary" 
            style={{
              padding: '10px 25px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="row" style={{ margin: '0 -10px' }}>
          {myRecipes.map((recipe, index) => (
            <div key={recipe.id || index} className="col-md-4 mb-4" style={{ padding: '0 10px' }}>
              <div className="card h-100" style={{
                border: 'none',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                }
              }}>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="card-img-top"
                    style={{ 
                      height: '220px', 
                      objectFit: 'cover',
                      width: '100%'
                    }}
                  />
                )}
                <div className="card-body" style={{ padding: '20px' }}>
                  <h5 className="card-title" style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '10px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {recipe.title}
                  </h5>
                  <p className="card-text" style={{
                    color: '#7f8c8d',
                    fontSize: '0.95rem',
                    marginBottom: '20px',
                    height: '60px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {recipe.description?.substring(0, 100)}...
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    justifyContent: 'flex-end',
                    marginTop: 'auto'
                  }}>
                    <Link
                      to={`/recipes/${recipe.id}`}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        ':hover': {
                          backgroundColor: '#5a6268',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <FaEye size={14} />
                      View
                    </Link><br/>
                    <button 
                      onClick={() => openEditModal(recipe)}
                      style={{
                        border: 'none',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        ':hover': {
                          backgroundColor: '#138496',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <FaEdit size={14} />
                      
                    </button>
                    <button 
                      onClick={() => handleDelete(recipe.id)}
                      style={{
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        ':hover': {
                          backgroundColor: '#c82333',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <FaTrash size={14} />
                      
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ 
          backgroundColor: "rgba(0,0,0,0.5)",
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="modal-dialog modal-lg" style={{ 
            maxWidth: '800px',
            margin: '1.75rem auto'
          }}>
            <div className="modal-content" style={{
              border: 'none',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
            }}>
              <div className="modal-header" style={{
                background: 'linear-gradient(135deg, #3498db, #2980b9)',
                color: 'white',
                padding: '20px',
                borderBottom: 'none'
              }}>
                <h5 className="modal-title" style={{
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>Edit Recipe</h5>
                <button 
                  type="button" 
                  className="close" 
                  onClick={() => setShowModal(false)}
                  style={{
                    color: 'white',
                    opacity: '0.8',
                    fontSize: '1.8rem',
                    background: 'none',
                    border: 'none',
                    transition: 'opacity 0.2s ease',
                    ':hover': {
                      opacity: '1'
                    }
                  }}
                >
                  <span>&times;</span>
                </button>
              </div>
              
              <div className="modal-body" style={{ padding: '25px' }}>
                {['title', 'description', 'ingredients', 'steps', 'imageUrl', 'tags'].map((field, index) => (
                  <div className="form-group mb-4" key={index} style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '500',
                      color: '#2c3e50',
                      fontSize: '0.95rem'
                    }}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === 'description' || field === 'steps' ? (
                      <textarea
                        className="form-control"
                        name={field}
                        value={editForm[field]}
                        onChange={handleChange}
                        rows={field === 'steps' ? '5' : '3'}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          ':focus': {
                            borderColor: '#3498db',
                            boxShadow: '0 0 0 0.2rem rgba(52, 152, 219, 0.25)',
                            outline: 'none'
                          }
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name={field}
                        value={editForm[field]}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '12px 15px',
                          borderRadius: '8px',
                          border: '1px solid #ddd',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          ':focus': {
                            borderColor: '#3498db',
                            boxShadow: '0 0 0 0.2rem rgba(52, 152, 219, 0.25)',
                            outline: 'none'
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer" style={{
                padding: '20px',
                borderTop: '1px solid #eee',
                background: '#f8f9fa',
                justifyContent: 'flex-end'
              }}>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-secondary" 
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    marginRight: '10px',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      background: '#6c757d',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="btn btn-primary"
                  style={{
                    padding: '10px 25px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Update Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipesEdit;