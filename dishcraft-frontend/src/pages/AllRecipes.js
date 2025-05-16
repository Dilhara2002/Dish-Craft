import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState({ id: null, text: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/recipes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRecipes(response.data);
        
        // Initialize state for each recipe
        const initialLikes = {};
        const initialComments = {};
        response.data.forEach(recipe => {
          initialLikes[recipe.id] = { count: 0, isLiked: false, likeId: null };
          initialComments[recipe.id] = [];
        });
        
        setLikes(initialLikes);
        setComments(initialComments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipes');
        setLoading(false);
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);

  const fetchRecipeInteractions = async (recipeId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      // Fetch likes
      const likesResponse = await axios.get(
        `http://localhost:8080/api/interaction/likes/recipe/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userLike = likesResponse.data.find(like => like.userId === userId);
      setLikes(prev => ({
        ...prev,
        [recipeId]: {
          count: likesResponse.data.length,
          isLiked: !!userLike,
          likeId: userLike?.id || null
        }
      }));

      // Fetch comments
      const commentsResponse = await axios.get(
        `http://localhost:8080/api/interaction/comments/recipe/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(prev => ({
        ...prev,
        [recipeId]: commentsResponse.data.map(comment => ({
          ...comment,
          createdAt: moment(comment.createdAt).format('MMM D, YYYY h:mm A'),
          updatedAt: moment(comment.updatedAt).format('MMM D, YYYY h:mm A')
        }))
      }));
    } catch (err) {
      console.error('Error fetching interactions:', err);
    }
  };

  const handleLike = async (recipeId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const currentLike = likes[recipeId];

    try {
      if (currentLike.isLiked) {
        // Unlike
        await axios.delete(`http://localhost:8080/api/interaction/likes/${recipeId}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        });

        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            ...prev[recipeId],
            count: prev[recipeId].count - 1,
            isLiked: false,
            likeId: null
          }
        }));
      } else {
        // Like
        const response = await axios.post(
          `http://localhost:8080/api/interaction/likes/${recipeId}`,
          {},
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              userId: userId
            }
          }
        );

        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            ...prev[recipeId],
            count: prev[recipeId].count + 1,
            isLiked: true,
            likeId: response.data.id || response.data
          }
        }));
      }
    } catch (err) {
      console.error('Error handling like:', err);
      setError('Failed to update like');
    }
  };

  const handleAddComment = async (recipeId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/interaction/comments/${recipeId}`,
        null,
        {
          params: { text: newComment },
          headers: { 
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        }
      );

      const addedComment = {
        ...response.data,
        username: username,
        createdAt: moment(response.data.createdAt).format('MMM D, YYYY h:mm A'),
        updatedAt: moment(response.data.updatedAt).format('MMM D, YYYY h:mm A')
      };

      setComments(prev => ({
        ...prev,
        [recipeId]: [...(prev[recipeId] || []), addedComment]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  };

  const startEditingComment = (comment) => {
    setEditingComment({ id: comment.id, text: comment.text });
  };

  const cancelEditing = () => {
    setEditingComment({ id: null, text: '' });
  };

  const handleUpdateComment = async (recipeId, commentId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.put(
        `http://localhost:8080/api/interaction/comments/${commentId}`,
        null,
        {
          params: { text: editingComment.text },
          headers: { 
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        }
      );

      setComments(prev => ({
        ...prev,
        [recipeId]: prev[recipeId].map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                text: response.data.text,
                updatedAt: moment(response.data.updatedAt).format('MMM D, YYYY h:mm A')
              }
            : comment
        )
      }));
      setEditingComment({ id: null, text: '' });
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment');
    }
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      await axios.delete(
        `http://localhost:8080/api/interaction/comments/${commentId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        }
      );

      setComments(prev => ({
        ...prev,
        [recipeId]: prev[recipeId].filter(comment => comment.id !== commentId)
      }));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading recipes...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>All Recipes</h2>
      <Link to="/add" className="btn btn-success mb-3">Add New Recipe</Link>

      <div className="row">
        {recipes.length === 0 && <p>No recipes found.</p>}

        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card h-100">
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text flex-grow-1">{recipe.description?.substring(0, 100)}...</p>
                
                {/* Like Section */}
                <div className="d-flex align-items-center mb-2">
                  <button 
                    onClick={() => handleLike(recipe.id)}
                    className="btn btn-sm btn-outline-danger me-2"
                    onMouseEnter={() => !likes[recipe.id]?.count && fetchRecipeInteractions(recipe.id)}
                  >
                    {likes[recipe.id]?.isLiked ? (
                      <FaHeart style={{ color: 'red' }} />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                  <span>{likes[recipe.id]?.count || 0} likes</span>
                </div>

                {/* Comments Section */}
                <div className="mb-3">
                  <h6 className="d-flex align-items-center">
                    <FaComment className="me-2" />
                    Comments ({comments[recipe.id]?.length || 0})
                  </h6>
                  <div 
                    className="comments-container border rounded p-2" 
                    style={{ maxHeight: '150px', overflowY: 'auto' }}
                    onMouseEnter={() => !comments[recipe.id] && fetchRecipeInteractions(recipe.id)}
                  >
                    {comments[recipe.id]?.map((comment) => (
                      <div key={comment.id} className="mb-2 pb-2 border-bottom">
                        <div className="d-flex justify-content-between">
                          <strong>{comment.username}</strong>
                          <small className="text-muted">{comment.createdAt}</small>
                        </div>
                        
                        {editingComment.id === comment.id ? (
                          <div className="mt-1">
                            <input
                              type="text"
                              className="form-control form-control-sm mb-1"
                              value={editingComment.text}
                              onChange={(e) => setEditingComment({
                                ...editingComment,
                                text: e.target.value
                              })}
                            />
                            <div className="d-flex justify-content-end">
                              <button
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleUpdateComment(recipe.id, comment.id)}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEditing}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="mb-1">{comment.text}</p>
                            {comment.userId === localStorage.getItem('userId') && (
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => startEditingComment(comment)}
                                >
                                  <FaEdit size={12} />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteComment(recipe.id, comment.id)}
                                >
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

                {/* Add Comment */}
                <div className="mt-auto">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onFocus={() => fetchRecipeInteractions(recipe.id)}
                    />
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddComment(recipe.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>

                <Link 
                  to={`/recipes/${recipe.id}`} 
                  className="btn btn-sm btn-outline-primary mt-2"
                >
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

export default RecipeList;