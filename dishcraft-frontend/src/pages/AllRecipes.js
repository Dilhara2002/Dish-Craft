import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [newComments, setNewComments] = useState({}); // recipeId -> comment string
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

      // Fetch all interactions once
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

    // Likes
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

    // Comments
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

  if (loading) return <div className="container mt-4">Loading recipes...</div>;

  return (
    <div className="container mt-4">
      <h2>All Recipes</h2>
      <Link to="/add" className="btn btn-success mb-3">Add New Recipe</Link>

      <div className="row">
        {recipes.length === 0 && <p>No recipes found.</p>}

        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-3">
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

                <div className="d-flex align-items-center mb-2">
                  <button onClick={() => handleLike(recipe.id)} className="btn btn-sm btn-outline-danger me-2">
                    {likes[recipe.id]?.isLiked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                  </button>
                  <span>{likes[recipe.id]?.count || 0} likes</span>
                </div>

                <div className="mb-3">
                  <h6 className="d-flex align-items-center">
                    <FaComment className="me-2" /> Comments ({comments[recipe.id]?.length || 0})
                  </h6>
                  <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {comments[recipe.id]?.map(comment => (
                      <div key={comment.id} className="mb-2 p-2 border-bottom">
                        <div className="d-flex justify-content-between">
                          <strong>{comment.username}</strong>
                          <small className="text-muted">{comment.createdAt}</small>
                        </div>

                        {editingComment.id === comment.id ? (
                          <>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editingComment.text}
                              onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                            />
                            <div className="d-flex justify-content-end mt-1">
                              <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdateComment(recipe.id, comment.id)}>
                                <FaCheck />
                              </button>
                              <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
                                <FaTimes />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mb-1">{comment.text}</p>
                            {comment.userId === userId && (
                              <div className="d-flex justify-content-end">
                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEditingComment(comment)}>
                                  <FaEdit size={12} />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(recipe.id, comment.id)}>
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Add a comment..."
                    value={newComments[recipe.id] || ''}
                    onChange={(e) => setNewComments(prev => ({ ...prev, [recipe.id]: e.target.value }))}
                  />
                  <button className="btn btn-sm btn-primary" onClick={() => handleAddComment(recipe.id)}>Post</button>
                </div>

                <Link to={`/MyRecipes/${recipe.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;
