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

  if (loading) {
    return (
      <div className="loading-container">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="my-recipes-container">
      <div className="header-section">
        <h2>My Recipes</h2>
        <Link to="/add" className="add-recipe-button">
          Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 && (
        <div className="empty-state">
          <p>No recipes found. Create your first recipe!</p>
        </div>
      )}

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-content">
              {recipe.imageUrl && (
                <div className="recipe-image-container">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                </div>
              )}
              
              <div className={`recipe-details ${recipe.imageUrl ? 'with-image' : 'full-width'}`}>
                <h3 className="recipe-title">{recipe.title}</h3>
                
                <p className="recipe-description">
                  {recipe.description?.substring(0, 150)}...
                </p>

                <div className="like-section">
                  <button 
                    onClick={() => handleLike(recipe.id)} 
                    className="like-button"
                  >
                    {likes[recipe.id]?.isLiked ? (
                      <FaHeart className="liked-icon" />
                    ) : (
                      <FaRegHeart className="not-liked-icon" />
                    )}
                  </button>
                  <span className="like-count">
                    {likes[recipe.id]?.count || 0} likes
                  </span>
                </div>

                <div className="comments-section">
                  <div className="comments-header">
                    <FaComment className="comment-icon" />
                    <span>Comments ({comments[recipe.id]?.length || 0})</span>
                  </div>
                  
                  <div className="comments-list">
                    {comments[recipe.id]?.length > 0 ? (
                      comments[recipe.id].map(comment => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <strong>{comment.username}</strong>
                            <small>{comment.createdAt}</small>
                          </div>

                          {editingComment.id === comment.id ? (
                            <>
                              <input
                                type="text"
                                className="comment-edit-input"
                                value={editingComment.text}
                                onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                              />
                              <div className="comment-edit-actions">
                                <button 
                                  className="save-edit-button"
                                  onClick={() => handleUpdateComment(recipe.id, comment.id)}
                                >
                                  <FaCheck size={12} /> Save
                                </button>
                                <button 
                                  className="cancel-edit-button"
                                  onClick={cancelEditing}
                                >
                                  <FaTimes size={12} /> Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="comment-text">{comment.text}</p>
                              {comment.userId === userId && (
                                <div className="comment-actions">
                                  <button 
                                    className="edit-comment-button"
                                    onClick={() => startEditingComment(comment)}
                                  >
                                    <FaEdit size={12} /> 
                                  </button>
                                  <button 
                                    className="delete-comment-button"
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
                      <p className="no-comments-message">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>

                  <div className="add-comment-section">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="comment-input"
                      value={newComments[recipe.id] || ''}
                      onChange={(e) => setNewComments(prev => ({ ...prev, [recipe.id]: e.target.value }))}
                    />
                    <button 
                      className="post-comment-button"
                      onClick={() => handleAddComment(recipe.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div className="view-details-button-container">
                  <Link 
                    to={`/recipes/${recipe.id}`}
                    className="view-details-button"
                  >
                    View Details
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .my-recipes-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: #666;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #dee2e6;
        }

        .header-section h2 {
          color: #343a40;
          font-weight: 600;
          margin: 0;
        }

        .add-recipe-button {
          background-color: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .add-recipe-button:hover {
          background-color: #218838;
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .empty-state p {
          font-size: 1.2rem;
          color: #6c757d;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .recipe-card {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .recipe-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }

        .recipe-content {
          display: flex;
          height: 100%;
        }

        .recipe-image-container {
          width: 40%;
          min-height: 300px;
          overflow: hidden;
        }

        .recipe-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .recipe-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .recipe-details.with-image {
          width: 60%;
        }

        .recipe-details.full-width {
          width: 100%;
        }

        .recipe-title {
          margin: 0 0 10px 0;
          color: #212529;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .recipe-description {
          color: #495057;
          font-size: 0.95rem;
          margin-bottom: 15px;
          flex-grow: 1;
        }

        .like-section {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          gap: 10px;
        }

        .like-button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .like-button:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }

        .liked-icon {
          color: #dc3545;
          font-size: 1.2rem;
        }

        .not-liked-icon {
          color: #6c757d;
          font-size: 1.2rem;
        }

        .like-count {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .comments-section {
          margin-bottom: 15px;
        }

        .comments-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          color: #495057;
          gap: 8px;
        }

        .comment-icon {
          color: #6c757d;
        }

        .comments-list {
          max-height: 150px;
          overflow-y: auto;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .comment-item {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e9ecef;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .comment-header strong {
          color: #212529;
        }

        .comment-header small {
          color: #6c757d;
        }

        .comment-text {
          margin: 0 0 8px 0;
          color: #495057;
          font-size: 0.9rem;
        }

        .comment-edit-input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .comment-edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .save-edit-button {
          border: none;
          background-color: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cancel-edit-button {
          border: none;
          background-color: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .comment-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .edit-comment-button {
          border: none;
          background-color: #17a2b8;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .delete-comment-button {
          border: none;
          background-color: #dc3545;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .no-comments-message {
          color: #6c757d;
          font-size: 0.9rem;
          text-align: center;
          margin: 10px 0;
        }

        .add-comment-section {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .comment-input {
          flex-grow: 1;
          padding: 8px 12px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .post-comment-button {
          border: none;
          background-color: #007bff;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .post-comment-button:hover {
          background-color: #0069d9;
        }

        .view-details-button-container {
          margin-top: auto;
          display: flex;
          justify-content: flex-end;
        }

        .view-details-button {
          background-color: #6c757d;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .view-details-button:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default MyRecipes;