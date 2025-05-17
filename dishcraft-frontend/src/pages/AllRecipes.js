import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editingComment, setEditingComment] = useState({ id: null, text: '' });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    axios.get('http://localhost:8080/api/recipes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const fetched = res.data;
      setRecipes(fetched);

      const initialLikes = {};
      const initialComments = {};
      fetched.forEach(recipe => {
        initialLikes[recipe.id] = { count: 0, isLiked: false, likeId: null };
        initialComments[recipe.id] = [];
      });
      setLikes(initialLikes);
      setComments(initialComments);

      fetched.forEach(recipe => {
        fetchRecipeInteractions(recipe.id);
      });

      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching recipes:', err);
      setLoading(false);
    });
  }, []);

  const fetchRecipeInteractions = (recipeId) => {
    if (!recipeId) return;

    axios.get(`http://localhost:8080/api/interaction/likes/recipe/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const userLike = res.data.find(like => like.userId === userId);
      setLikes(prev => ({
        ...prev,
        [recipeId]: {
          count: res.data.length,
          isLiked: !!userLike,
          likeId: userLike?.id || null
        }
      }));
    })
    .catch(err => console.error('Error fetching likes:', err));

    axios.get(`http://localhost:8080/api/interaction/comments/recipe/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setComments(prev => ({
        ...prev,
        [recipeId]: res.data.map(comment => ({
          ...comment,
          createdAt: moment(comment.createdAt).format('MMM D, YYYY h:mm A'),
          updatedAt: moment(comment.updatedAt).format('MMM D, YYYY h:mm A')
        }))
      }));
    })
    .catch(err => console.error('Error fetching comments:', err));
  };

  const handleLike = (recipeId) => {
    const current = likes[recipeId];
    if (!current) return;

    if (current.isLiked) {
      axios.delete(`http://localhost:8080/api/interaction/likes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}`, userId }
      })
      .then(() => {
        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            ...prev[recipeId],
            count: prev[recipeId].count - 1,
            isLiked: false,
            likeId: null
          }
        }));
      })
      .catch(err => console.error('Error unliking recipe:', err));
    } else {
      axios.post(`http://localhost:8080/api/interaction/likes/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}`, userId }
      })
      .then(res => {
        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            count: prev[recipeId].count + 1,
            isLiked: true,
            likeId: res.data.id
          }
        }));
      })
      .catch(err => console.error('Error liking recipe:', err));
    }
  };

  const handleAddComment = (recipeId) => {
    const text = newComments[recipeId]?.trim();
    if (!text) return;

    axios.post(`http://localhost:8080/api/interaction/comments/${recipeId}`, null, {
      params: { text },
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(res => {
      const newCommentObj = {
        ...res.data,
        username,
        createdAt: moment(res.data.createdAt).format('MMM D, YYYY h:mm A'),
        updatedAt: moment(res.data.updatedAt).format('MMM D, YYYY h:mm A')
      };
      setComments(prev => ({
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), newCommentObj]
      }));
      setNewComments(prev => ({ ...prev, [recipeId]: '' }));
    })
    .catch(err => console.error('Error adding comment:', err));
  };

  const startEditingComment = (comment) => {
    setEditingComment({ id: comment.id, text: comment.text });
  };

  const cancelEditing = () => {
    setEditingComment({ id: null, text: '' });
  };

  const handleUpdateComment = (recipeId, commentId) => {
    axios.put(`http://localhost:8080/api/interaction/comments/${commentId}`, null, {
      params: { text: editingComment.text },
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(res => {
      setComments(prev => ({
        ...prev,
        [recipeId]: prev[recipeId].map(c => 
          c.id === commentId 
            ? { ...c, text: res.data.text, updatedAt: moment(res.data.updatedAt).format('MMM D, YYYY h:mm A') }
            : c
        )
      }));
      cancelEditing();
    })
    .catch(err => console.error('Error updating comment:', err));
  };

  const handleDeleteComment = (recipeId, commentId) => {
    axios.delete(`http://localhost:8080/api/interaction/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(() => {
      setComments(prev => ({
        ...prev,
        [recipeId]: prev[recipeId].filter(c => c.id !== commentId)
      }));
    })
    .catch(err => console.error('Error deleting comment:', err));
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      color: '#666'
    }}>
      Loading recipes...
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #dee2e6'
      }}>
        <h2 style={{
          color: '#343a40',
          fontWeight: '600',
          margin: 0
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

      {recipes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>No recipes found. Create your first recipe!</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: '25px',
        marginTop: '20px'
      }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <div style={{ display: 'flex', height: '100%' }}>
              {recipe.imageUrl && (
                <div style={{
                  width: '40%',
                  minHeight: '300px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>
              )}
              
              <div style={{
                width: recipe.imageUrl ? '60%' : '100%',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: '#212529',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  {recipe.title}
                </h3>
                
                <p style={{
                  color: '#495057',
                  fontSize: '0.95rem',
                  marginBottom: '15px',
                  flexGrow: 1
                }}>
                  {recipe.description?.substring(0, 150)}...
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  gap: '10px'
                }}>
                  <button 
                    onClick={() => handleLike(recipe.id)} 
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '5px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      ':hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.1)'
                      }
                    }}
                  >
                    {likes[recipe.id]?.isLiked ? (
                      <FaHeart style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                    ) : (
                      <FaRegHeart style={{ color: '#6c757d', fontSize: '1.2rem' }} />
                    )}
                  </button>
                  <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {likes[recipe.id]?.count || 0} likes
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    color: '#495057',
                    gap: '8px'
                  }}>
                    <FaComment style={{ color: '#6c757d' }} />
                    <span style={{ fontWeight: '500' }}>
                      Comments ({comments[recipe.id]?.length || 0})
                    </span>
                  </div>
                  
                  <div style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    padding: '10px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}>
                    {comments[recipe.id]?.length > 0 ? (
                      comments[recipe.id].map(comment => (
                        <div key={comment.id} style={{
                          marginBottom: '12px',
                          paddingBottom: '12px',
                          borderBottom: '1px solid #e9ecef'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px'
                          }}>
                            <strong style={{ color: '#212529' }}>{comment.username}</strong>
                            <small style={{ color: '#6c757d' }}>{comment.createdAt}</small>
                          </div>

                          {editingComment.id === comment.id ? (
                            <>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '6px 10px',
                                  border: '1px solid #ced4da',
                                  borderRadius: '4px',
                                  marginBottom: '8px'
                                }}
                                value={editingComment.text}
                                onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                              />
                              <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px'
                              }}>
                                <button 
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onClick={() => handleUpdateComment(recipe.id, comment.id)}
                                >
                                  <FaCheck size={12} /> Save
                                </button>
                                <button 
                                  style={{
                                    border: 'none',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onClick={cancelEditing}
                                >
                                  <FaTimes size={12} /> Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p style={{ 
                                margin: '0 0 8px 0',
                                color: '#495057',
                                fontSize: '0.9rem'
                              }}>
                                {comment.text}
                              </p>
                              {comment.userId === userId && (
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  gap: '8px'
                                }}>
                                  <button 
                                    style={{
                                      border: 'none',
                                      backgroundColor: '#17a2b8',
                                      color: 'white',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    onClick={() => startEditingComment(comment)}
                                  >
                                    <FaEdit size={12} /> 
                                  </button>
                                  <button 
                                    style={{
                                      border: 'none',
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    onClick={() => handleDeleteComment(recipe.id, comment.id)}
                                  >
                                    <FaTrash size={12} /> 
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p style={{ 
                        color: '#6c757d',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        margin: '10px 0'
                      }}>
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '10px'
                  }}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      style={{
                        flexGrow: 1,
                        padding: '8px 12px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                      value={newComments[recipe.id] || ''}
                      onChange={(e) => setNewComments(prev => ({ ...prev, [recipe.id]: e.target.value }))}
                    />
                    <button 
                      style={{
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        ':hover': {
                          backgroundColor: '#0069d9'
                        }
                      }}
                      onClick={() => handleAddComment(recipe.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link 
                    to={`/MyRecipes/${recipe.id}`}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      ':hover': {
                        backgroundColor: '#5a6268'
                      }
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;