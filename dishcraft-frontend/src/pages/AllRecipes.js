import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/recipes/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRecipes(res.data);
      res.data.forEach(recipe => {
        fetchLikes(recipe.id);
        fetchComments(recipe.id);
      });
    })
    .catch(err => console.error('Error loading recipes:', err));
  }, []);

  const fetchLikes = (recipeId) => {
    axios.get(`http://localhost:8080/api/interaction/likes/recipe/${recipeId}`)
      .then(res => setLikes(prev => ({ ...prev, [recipeId]: res.data })))
      .catch(err => console.error('Error fetching likes:', err));
  };

  const fetchComments = (recipeId) => {
    axios.get(`http://localhost:8080/api/interaction/comments/recipe/${recipeId}`)
      .then(res => setComments(prev => ({ ...prev, [recipeId]: res.data })))
      .catch(err => console.error('Error fetching comments:', err));
  };

  const hasUserLiked = (recipeId) => {
    return (likes[recipeId] || []).some(like => like.userId === userId);
  };

  const handleLike = (recipeId) => {
    if (hasUserLiked(recipeId)) return;

    axios.post(`http://localhost:8080/api/interaction/likes/${recipeId}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        userId
      }
    }).then(() => fetchLikes(recipeId))
      .catch(err => console.error('Error liking recipe:', err));
  };

  const handleCommentSubmit = (recipeId) => {
    const text = newComments[recipeId];
    if (!text) return;

    axios.post(`http://localhost:8080/api/interaction/comments/${recipeId}?text=${encodeURIComponent(text)}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        userId
      }
    }).then(() => {
      fetchComments(recipeId);
      setNewComments(prev => ({ ...prev, [recipeId]: '' }));
    });
  };

  return (
    <div className="container mt-4">
      <h2>All Recipes</h2>
      <div className="row">
        {recipes.map((recipe, index) => (
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
                <Link to={`/recipes/${recipe.id}`} className="btn btn-sm btn-outline-primary me-2">
                  View Details
                </Link>

                {/* Like Button */}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleLike(recipe.id)}
                  disabled={hasUserLiked(recipe.id)}
                >
                  ❤️ Like ({(likes[recipe.id] || []).length})
                </button>

                {/* Comments */}
                <div className="mt-3">
                  <h6>Comments</h6>
                  <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '0.9em' }}>
                    {(comments[recipe.id] || []).map((comment, i) => (
                      <p key={i}>
                        <strong>{comment.username || comment.userId}</strong>: {comment.text}
                      </p>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-sm mt-2"
                    placeholder="Add a comment..."
                    value={newComments[recipe.id] || ''}
                    onChange={(e) =>
                      setNewComments(prev => ({ ...prev, [recipe.id]: e.target.value }))
                    }
                  />
                  <button
                    className="btn btn-sm btn-primary mt-1"
                    onClick={() => handleCommentSubmit(recipe.id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRecipes;
