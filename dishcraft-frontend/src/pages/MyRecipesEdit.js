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

  const chunkRecipes = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

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

  const recipePairs = chunkRecipes(myRecipes, 2);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e63946'
      }}>
        <h2 style={{
          color: '#1d3557',
          fontSize: '32px',
          fontWeight: '700',
          margin: '0',
          letterSpacing: '1px'
        }}>
          My Recipe Collection
        </h2>
        <Link 
          to="/add" 
          style={{
            backgroundColor: '#e63946',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c1121f';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#e63946';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          <span>+</span> Create New Recipe
        </Link>
      </div>

      {myRecipes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            color: '#e63946'
          }}>🍳</div>
          <h3 style={{
            color: '#1d3557',
            fontSize: '24px',
            marginBottom: '10px'
          }}>Your Recipe Box is Empty</h3>
          <p style={{
            color: '#457b9d',
            fontSize: '16px',
            marginBottom: '25px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Start your culinary journey by adding your first recipe!
          </p>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
      }}>
        {recipePairs.map((pair, pairIndex) => (
          <div 
            key={pairIndex}
            style={{
              display: 'flex',
              gap: '30px',
              justifyContent: 'space-between'
            }}
          >
            {pair.map((recipe, index) => (
              <div 
                key={recipe.id || index}
                style={{
                  flex: '1',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                  minWidth: '0'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                }}
              >
                {recipe.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '280px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                )}
                <div style={{ 
                  padding: '25px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '25px',
                    backgroundColor: '#e63946',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '50px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    {recipe.category || 'Uncategorized'}
                  </div>
                  <h3 style={{
                    marginTop: '15px',
                    marginBottom: '15px',
                    color: '#1d3557',
                    fontSize: '22px',
                    fontWeight: '700',
                    lineHeight: '1.3'
                  }}>
                    {recipe.title}
                  </h3>
                  <p style={{
                    color: '#457b9d',
                    marginBottom: '25px',
                    lineHeight: '1.6',
                    fontSize: '15px'
                  }}>
                    {recipe.description?.substring(0, 120)}...
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <span style={{
                        backgroundColor: '#f1faee',
                        color: '#1d3557',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ⏱️ {recipe.cookTime || 'N/A'} mins
                      </span>
                      <span style={{
                        backgroundColor: '#f1faee',
                        color: '#1d3557',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        � {recipe.servings || 'N/A'} servings
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '10px'
                    }}>
                      <button
                        onClick={() => openEditModal(recipe)}
                        style={{
                          backgroundColor: '#1d3557',
                          color: 'white',
                          padding: '8px 15px',
                          borderRadius: '50px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#457b9d';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#1d3557';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        style={{
                          backgroundColor: '#e63946',
                          color: 'white',
                          padding: '8px 15px',
                          borderRadius: '50px',
                          border: 'none',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#c1121f';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#e63946';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <div style={{
              padding: '25px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                margin: 0,
                color: '#1d3557',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                Edit Recipe
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.color = '#e63946'}
                onMouseOut={(e) => e.target.color = '#6c757d'}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '25px' }}>
              {['title', 'description', 'ingredients', 'steps', 'imageUrl', 'tags'].map((field, index) => (
                <div style={{ marginBottom: '20px' }} key={index}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#1d3557',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === 'description' || field === 'steps' ? (
                    <textarea
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        transition: 'border-color 0.3s ease',
                        minHeight: field === 'steps' ? '150px' : '100px'
                      }}
                      name={field}
                      value={editForm[field]}
                      onChange={handleChange}
                      onFocus={(e) => e.target.style.borderColor = '#457b9d'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                  ) : (
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        transition: 'border-color 0.3s ease'
                      }}
                      name={field}
                      value={editForm[field]}
                      onChange={handleChange}
                      onFocus={(e) => e.target.style.borderColor = '#457b9d'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{
              padding: '20px 25px',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '15px'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '15px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#5a6268';
                  e.target.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: '#1d3557',
                  color: 'white',
                  padding: '10px 25px',
                  borderRadius: '50px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '15px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#457b9d';
                  e.target.style.transform = 'scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#1d3557';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Update Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipesEdit;