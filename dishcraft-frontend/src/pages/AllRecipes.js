import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaComment, FaEdit, 
  FaTrash, FaCheck, FaTimes, FaPlus, FaTimes as FaClose
} from 'react-icons/fa';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

// Comment Modal Component
const CommentModal = ({ show, onClose, recipeId, recipeTitle, comments, username, userId, token,
                       onAddComment, onUpdateComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState({ id: null, text: '' });

  // Moved useEffect to the top before any conditional returns
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  // Conditional return after all hooks
  if (!show) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    axios.post(`http://localhost:8080/api/interaction/comments/${recipeId}`, null, {
      params: { text: newComment },
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(res => {
      const newCommentObj = {
        ...res.data,
        username,
        createdAt: moment(res.data.createdAt).format('MMM D, YYYY h:mm A'),
        updatedAt: moment(res.data.updatedAt).format('MMM D, YYYY h:mm A')
      };
      onAddComment(recipeId, newCommentObj);
      setNewComment('');
    })
    .catch(err => console.error('Error adding comment:', err));
  };

  const startEditingComment = (comment) => {
    setEditingComment({ id: comment.id, text: comment.text });
  };

  const cancelEditing = () => {
    setEditingComment({ id: null, text: '' });
  };

  const handleUpdateComment = (commentId) => {
    axios.put(`http://localhost:8080/api/interaction/comments/${commentId}`, null, {
      params: { text: editingComment.text },
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(res => {
      onUpdateComment(recipeId, commentId, {
        text: res.data.text,
        updatedAt: moment(res.data.updatedAt).format('MMM D, YYYY h:mm A')
      });
      cancelEditing();
    })
    .catch(err => console.error('Error updating comment:', err));
  };

  const handleDeleteComment = (commentId) => {
    axios.delete(`http://localhost:8080/api/interaction/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}`, userId }
    })
    .then(() => {
      onDeleteComment(recipeId, commentId);
    })
    .catch(err => console.error('Error deleting comment:', err));
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{recipeTitle} - Comments</h5>
            <button className="close-button" onClick={onClose}>
              <FaClose />
            </button>
          </div>
          
          {/* Comments List */}
          <div className="modal-body">
            {comments.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    {editingComment.id === comment.id ? (
                      <div className="w-100">
                        <div className="edit-comment-container">
                          <input
                            type="text"
                            className="form-control"
                            value={editingComment.text}
                            onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                          />
                          <div className="edit-buttons">
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => handleUpdateComment(comment.id)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={cancelEditing}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="comment-content">
                        <div className="comment-header">
                          <div className="comment-user">
                            <div className="user-avatar">
                              {comment.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <span className="username">{comment.username}</span>
                          </div>
                          {comment.userId === userId && (
                            <div className="comment-actions">
                              <button 
                                className="action-btn edit-btn"
                                onClick={() => startEditingComment(comment)}
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-meta">
                          <small className="comment-time">{comment.createdAt}</small>
                          {comment.createdAt !== comment.updatedAt && (
                            <small className="edited-tag">· Edited</small>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add Comment */}
          <div className="modal-footer">
            <div className="add-comment-container">
              <input
                type="text"
                className="form-control"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button 
                className="btn btn-primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 1050;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.2s ease-out;
        }
        
        .modal-container {
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
        }
        
        .modal-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 90vh;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #dee2e6;
        }
        
        .modal-title {
          font-weight: 600;
          margin: 0;
          font-size: 1.1rem;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6c757d;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-body {
          padding: 0;
          overflow-y: auto;
          flex: 1;
          max-height: calc(90vh - 140px);
        }
        
        .comments-list {
          padding: 0;
        }
        
        .comment-item {
          padding: 15px 20px;
          border-bottom: 1px solid #f0f2f5;
        }
        
        .comment-content {
          display: flex;
          flex-direction: column;
        }
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        
        .comment-user {
          display: flex;
          align-items: center;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #ff6b6b;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
          font-size: 14px;
        }
        
        .username {
          font-weight: 600;
          font-size: 14px;
        }
        
        .comment-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          background: none;
          border: none;
          padding: 2px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .action-btn:hover {
          opacity: 1;
        }
        
        .edit-btn {
          color: #6c757d;
        }
        
        .delete-btn {
          color: #dc3545;
        }
        
        .comment-text {
          margin: 0 0 6px 42px;
          font-size: 14px;
          line-height: 1.4;
          color: #212529;
        }
        
        .comment-meta {
          margin-left: 42px;
          display: flex;
          gap: 4px;
          font-size: 12px;
          color: #6c757d;
        }
        
        .edited-tag {
          font-style: italic;
        }
        
        .edit-comment-container {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .edit-buttons {
          display: flex;
          gap: 4px;
        }
        
        .modal-footer {
          padding: 12px 16px;
          border-top: 1px solid #dee2e6;
        }
        
        .add-comment-container {
          display: flex;
          gap: 10px;
        }
        
        .add-comment-container input {
          flex: 1;
          border-radius: 20px;
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          background-color: #f8f9fa;
        }
        
        .add-comment-container button {
          border-radius: 20px;
          padding: 6px 16px;
          font-weight: 500;
          background-color: #ff6b6b;
          border-color: #ff6b6b;
        }
        
        .add-comment-container button:hover:not(:disabled) {
          background-color: #ff5252;
          border-color: #ff5252;
        }
        
        .add-comment-container button:disabled {
          background-color: #ff9e9e;
          border-color: #ff9e9e;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [newComments, setNewComments] = useState({});
  const [editingComment, setEditingComment] = useState({ id: null, text: '' });
  const [loading, setLoading] = useState(true);
  const [activeCommentModal, setActiveCommentModal] = useState(null);

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

  const handleLike = async (recipeId) => {
    try {
      const current = likes[recipeId];
      if (!current) {
        console.error('No like data found for recipe:', recipeId);
        return;
      }
  
      if (current.isLiked) {
        // Debug log to check what we're sending
        console.log('Attempting to unlike:', {
          recipeId,
          likeId: current.likeId,
          userId
        });
  
        if (!current.likeId) {
          console.error('Cannot unlike - no likeId found');
          return;
        }
  
        const response = await axios.delete(
          `http://localhost:8080/api/interaction/likes/${current.likeId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              userId: userId 
            },
            params: {
              recipeId: recipeId  // Some APIs might need this
            }
          }
        );
  
        console.log('Unlike successful:', response.data);
  
        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            ...prev[recipeId],
            count: Math.max(0, prev[recipeId].count - 1), // Ensure count doesn't go negative
            isLiked: false,
            likeId: null
          }
        }));
  
      } else {
        // Debug log for like action
        console.log('Attempting to like recipe:', recipeId);
  
        const response = await axios.post(
          `http://localhost:8080/api/interaction/likes/${recipeId}`,
          {}, // Empty body
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              userId: userId 
            }
          }
        );
  
        console.log('Like successful:', response.data);
  
        setLikes(prev => ({
          ...prev,
          [recipeId]: {
            count: prev[recipeId].count + 1,
            isLiked: true,
            likeId: response.data.id // Ensure we're capturing the likeId correctly
          }
        }));
      }
    } catch (error) {
      console.error('Error in handleLike:', {
        error: error.response?.data || error.message,
        recipeId,
        currentLikeState: likes[recipeId]
      });
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

  // Modal handlers for comments
  const openCommentModal = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    setActiveCommentModal({
      recipeId,
      title: recipe?.title || "Recipe"
    });
  };

  const closeCommentModal = () => {
    setActiveCommentModal(null);
  };

  const handleModalAddComment = (recipeId, newComment) => {
    setComments(prev => ({
      ...prev,
      [recipeId]: [...(prev[recipeId] || []), newComment]
    }));
  };

  const handleModalUpdateComment = (recipeId, commentId, updates) => {
    setComments(prev => ({
      ...prev,
      [recipeId]: prev[recipeId].map(c => 
        c.id === commentId 
          ? { ...c, ...updates }
          : c
      )
    }));
  };

  const handleModalDeleteComment = (recipeId, commentId) => {
    setComments(prev => ({
      ...prev,
      [recipeId]: prev[recipeId].filter(c => c.id !== commentId)
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Instagram-like header with sticky top */}
        <div className="sticky-top bg-white border-bottom shadow-sm mb-4 py-3" style={{ zIndex: 1000 }}>
          <div className="container d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{ fontFamily: 'cursive', color: '#ff6b6b' }}></h4>
            <Link 
              to="/add" 
              className="btn btn-primary d-flex align-items-center"
              style={{
                borderRadius: '20px',
                padding: '8px 16px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#0D6EFD',
                borderColor: '#0D6EFD'
              }}
            >
              <FaPlus className="me-1" />
              Add Recipe
            </Link>
          </div>
        </div>

        {recipes.length === 0 && (
          <div className="card text-center p-5 mb-4" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <h5 className="card-title">No recipes found</h5>
              <p className="card-text text-muted">Create your first recipe!</p>
              <Link 
                to="/add" 
                className="btn btn-primary"
                style={{
                  borderRadius: '20px',
                  padding: '8px 20px',
                  fontWeight: '600',
                  backgroundColor: '#ff6b6b',
                  borderColor: '#ff6b6b'
                }}
              >
                Add New Recipe
              </Link>
            </div>
          </div>
        )}

        {/* Recipe cards grid - 2 per row */}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="col">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease',
                }}
              >
                {/* Card header with user info */}
                <div className="card-header bg-white d-flex align-items-center p-3 border-0">
                  <div 
                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" 
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      backgroundColor: '#ff6b6b',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    {recipe.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{recipe.username || "User"}</h6>
                    <small className="text-muted">{moment(recipe.createdAt).fromNow()}</small>
                  </div>
                </div>
                
                {/* Image container */}
                {recipe.imageUrl && (
                  <div 
                    className="position-relative" 
                    style={{ 
                      paddingBottom: "75%", 
                      overflow: "hidden",
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="card-body p-3 pt-2 pb-0">
                  <div className="d-flex gap-3 mb-2">
                    <button 
                      onClick={() => handleLike(recipe.id)} 
                      className="btn btn-link p-0 border-0"
                      style={{ color: likes[recipe.id]?.isLiked ? '#ff6b6b' : '#495057' }}
                    >
                      {likes[recipe.id]?.isLiked ? (
                        <FaHeart className="fs-4" />
                      ) : (
                        <FaRegHeart className="fs-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => openCommentModal(recipe.id)} 
                      className="btn btn-link p-0 border-0"
                      style={{ color: '#495057' }}
                    >
                      <FaComment className="fs-4" />
                    </button>
                  </div>
                  
                  {/* Likes count */}
                  <div className="mb-1">
                    <p className="fw-bold mb-0" style={{ color: '#212529' }}>
                      {likes[recipe.id]?.count || 0} likes
                    </p>
                  </div>
                  
                  {/* Recipe title and description */}
                  <div className="mb-2">
                    <h5 className="mb-1" style={{ color: '#212529', fontSize: '18px' }}>
                      {recipe.title}
                    </h5>
                    <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                      {recipe.description?.substring(0, 100)}{recipe.description?.length > 100 ? '...' : ''}
                    </p>
                    <Link 
                      to={`/recipes/${recipe.id}`} 
                      className="text-decoration-none"
                      style={{ 
                        color: '#0D6EFD',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      View Details &raquo;
                    </Link>
                  </div>
                  
                  {/* Comments section */}
                  <div className="mt-2">
                    {comments[recipe.id]?.length > 0 && (
                      <div className="mb-2">
                        <button 
                          onClick={() => openCommentModal(recipe.id)} 
                          className="text-muted text-decoration-none border-0 bg-transparent p-0 small"
                          style={{ cursor: 'pointer', color: '#6c757d' }}
                        >
                          View all {comments[recipe.id].length} comments
                        </button>
                        
                        {/* Show last 2 comments */}
                        <div className="mt-1">
                          {comments[recipe.id].slice(-2).map(comment => (
                            <div key={comment.id} className="d-flex mb-1 align-items-start">
                              {editingComment.id === comment.id ? (
                                <div className="w-100">
                                  <div className="input-group mb-1">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editingComment.text}
                                      onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                                      style={{ borderRadius: '20px' }}
                                    />
                                    <button 
                                      className="btn btn-success btn-sm ms-1"
                                      onClick={() => handleUpdateComment(recipe.id, comment.id)}
                                      style={{ borderRadius: '20px' }}
                                    >
                                      <FaCheck />
                                    </button>
                                    <button 
                                      className="btn btn-secondary btn-sm ms-1"
                                      onClick={cancelEditing}
                                      style={{ borderRadius: '20px' }}
                                    >
                                      <FaTimes />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="mb-0" style={{ fontSize: '14px' }}>
                                    <span className="fw-bold me-2" style={{ color: '#212529' }}>{comment.username}</span>
                                    <span style={{ color: '#495057' }}>{comment.text}</span>
                                  </p>
                                  
                                  {comment.userId === userId && (
                                    <div className="ms-auto d-flex">
                                      <button 
                                        className="btn btn-link text-secondary p-0 me-2 border-0"
                                        onClick={() => startEditingComment(comment)}
                                        style={{ fontSize: '12px' }}
                                      >
                                        <FaEdit />
                                      </button>
                                      <button 
                                        className="btn btn-link text-danger p-0 border-0"
                                        onClick={() => handleDeleteComment(recipe.id, comment.id)}
                                        style={{ fontSize: '12px' }}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Add comment input */}
                    <div className="input-group input-group-sm border-top pt-2">
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Add a comment..."
                        value={newComments[recipe.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ ...prev, [recipe.id]: e.target.value }))}
                        style={{ 
                          borderRadius: '20px',
                          padding: '8px 12px',
                          fontSize: '14px'
                        }}
                      />
                      <button 
                        className="btn btn-link text-primary"
                        onClick={() => handleAddComment(recipe.id)}
                        disabled={!newComments[recipe.id]?.trim()}
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          textDecoration: 'none',
                          color: '#ff6b6b'
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      {activeCommentModal && (
        <CommentModal
          show={!!activeCommentModal}
          onClose={closeCommentModal}
          recipeId={activeCommentModal.recipeId}
          recipeTitle={activeCommentModal.title}
          comments={comments[activeCommentModal.recipeId] || []}
          username={username}
          userId={userId}
          token={token}
          onAddComment={handleModalAddComment}
          onUpdateComment={handleModalUpdateComment}
          onDeleteComment={handleModalDeleteComment}
        />
      )}
    </div>
  );
};

export default AllRecipes;