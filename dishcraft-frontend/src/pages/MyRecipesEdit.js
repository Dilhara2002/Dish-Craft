import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaComment, FaEdit, 
  FaTrash, FaCheck, FaTimes, FaPlus 
} from 'react-icons/fa';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      const fetched = res.data.filter(recipe => recipe.userId === userId);
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
        <div className="sticky-top bg-white border-bottom shadow-sm mb-4">
          <div className="container d-flex justify-content-between align-items-center py-3">
            <h2 className="h4 mb-0 fw-bold text-primary">My Recipes</h2>
            <Link 
              to="/add" 
              className="btn btn-primary rounded-circle p-2"
              title="Add New Recipe"
            >
              <FaPlus />
            </Link>
          </div>
        </div>

        {recipes.length === 0 && (
          <div className="card text-center p-5 mb-4">
            <div className="card-body">
              <h5 className="card-title">No recipes found</h5>
              <p className="card-text text-muted">You haven't created any recipes yet.</p>
              <Link to="/add" className="btn btn-primary">
                Add New Recipe
              </Link>
            </div>
          </div>
        )}

        <div className="d-flex flex-column align-items-center">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="card mb-4 border-0 shadow-sm" style={{ maxWidth: "600px", width: "100%" }}>
              <div className="card-header bg-white d-flex align-items-center p-3 border-0">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px" }}>
                  {recipe.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{recipe.username || "User"}</h6>
                </div>
              </div>

              {recipe.imageUrl && (
                <div className="position-relative" style={{ paddingBottom: "100%", overflow: "hidden" }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                  />
                </div>
              )}

              <div className="card-body p-3 pt-2">
                <div className="d-flex gap-3 mb-2">
                  <button 
                    onClick={() => handleLike(recipe.id)} 
                    className="btn btn-link p-0 border-0"
                  >
                    {likes[recipe.id]?.isLiked ? (
                      <FaHeart className="fs-4 text-danger" />
                    ) : (
                      <FaRegHeart className="fs-4" />
                    )}
                  </button>
                  <Link to={`/recipes/${recipe.id}`} className="btn btn-link p-0 border-0">
                    <FaComment className="fs-4" />
                  </Link>
                </div>

                <div className="mb-1">
                  <p className="fw-bold mb-0">{likes[recipe.id]?.count || 0} likes</p>
                </div>

                <div className="mb-2">
                  <p className="mb-1">
                    <span className="fw-bold me-2">{recipe.title}</span>
                    <span className="text-muted">{recipe.description?.substring(0, 100)}{recipe.description?.length > 100 ? '...' : ''}</span>
                  </p>
                  <Link to={`/recipes/${recipe.id}`} className="text-muted text-decoration-none">
                    View full recipe
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
