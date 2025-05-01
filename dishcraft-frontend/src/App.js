import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CommentLikeSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [userId] = useState(localStorage.getItem('userId') || 'default-user');
  const [isLiked, setIsLiked] = useState(false);

  // Define styles
  const styles = {
    interactionSection: {
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    },
    likeSection: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #eee'
    },
    likeButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#f0f0f0',
      cursor: 'pointer',
      fontSize: '14px',
      marginRight: '10px',
      transition: 'background-color 0.3s'
    },
    likedButton: {
      backgroundColor: '#ffebee'
    },
    likeCount: {
      fontSize: '14px',
      color: '#666'
    },
    commentSection: {
      marginTop: '20px'
    },
    addComment: {
      marginBottom: '20px'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      resize: 'vertical',
      minHeight: '80px',
      marginBottom: '10px',
      fontFamily: 'inherit'
    },
    submitButton: {
      padding: '8px 16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    commentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    comment: {
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    commentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px'
    },
    commentUser: {
      fontWeight: 'bold',
      color: '#333'
    },
    commentDate: {
      color: '#888'
    },
    commentText: {
      margin: '10px 0',
      lineHeight: '1.5'
    },
    commentActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    actionButton: {
      padding: '4px 8px',
      fontSize: '12px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer'
    },
    editComment: {
      marginBottom: '10px'
    }
  };

  // Memoize functions to prevent unnecessary recreations
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/interaction/comments/recipe/${recipeId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [recipeId]);

  const fetchLikes = useCallback(async () => {
    try {
      const response = await axios.get(`/api/interaction/likes/recipe/${recipeId}`);
      setLikes(response.data);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, [recipeId]);

  const checkUserLike = useCallback(async () => {
    try {
      const response = await axios.get(`/api/interaction/likes/recipe/${recipeId}`);
      const userLike = response.data.find(like => like.userId === userId);
      setIsLiked(!!userLike);
    } catch (error) {
      console.error('Error checking user like:', error);
    }
  }, [recipeId, userId]);

  useEffect(() => {
    fetchComments();
    fetchLikes();
    checkUserLike();
  }, [recipeId, userId, fetchComments, fetchLikes, checkUserLike]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post(`/api/interaction/comments/${recipeId}`, null, {
        params: { text: newComment },
        headers: { userId }
      });
      
      if (response.status === 200) {
        setComments([...comments, response.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await axios.put(`/api/interaction/comments/${commentId}`, null, {
        params: { text: editCommentText },
        headers: { userId }
      });
      
      if (response.data) {
        setComments(comments.map(comment => 
          comment.id === commentId ? response.data : comment
        ));
        setEditingCommentId(null);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/interaction/comments/${commentId}`, {
        headers: { userId }
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.delete(`/api/interaction/likes/${recipeId}`, {
          headers: { userId }
        });
        setIsLiked(false);
        setLikes(likes.filter(like => like.userId !== userId));
      } else {
        const response = await axios.post(`/api/interaction/likes/${recipeId}`, null, {
          headers: { userId }
        });
        setIsLiked(true);
        if (response.data) {
          setLikes([...likes, response.data]);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  return (
    <div style={styles.interactionSection}>
      <div style={styles.likeSection}>
        <button 
          onClick={handleLike}
          style={{ ...styles.likeButton, ...(isLiked ? styles.likedButton : {}) }}
        >
          {isLiked ? '❤️ Unlike' : '🤍 Like'}
        </button>
        <span style={styles.likeCount}>{likes.length} likes</span>
      </div>

      <div style={styles.commentSection}>
        <h3>Comments ({comments.length})</h3>
        
        <div style={styles.addComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            style={styles.textarea}
          />
          <button 
            onClick={handleAddComment}
            style={styles.submitButton}
          >
            Post Comment
          </button>
        </div>

        <div style={styles.commentsList}>
          {comments.map(comment => (
            <div key={comment.id} style={styles.comment}>
              {editingCommentId === comment.id ? (
                <div style={styles.editComment}>
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    style={styles.textarea}
                  />
                  <button 
                    onClick={() => handleUpdateComment(comment.id)}
                    style={{ ...styles.actionButton, backgroundColor: '#4CAF50', color: 'white' }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingCommentId(null)}
                    style={styles.actionButton}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentUser}>User {comment.userId}</span>
                    <span style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={styles.commentText}>{comment.text}</p>
                  {comment.userId === userId && (
                    <div style={styles.commentActions}>
                      <button 
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.text);
                        }}
                        style={styles.actionButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        style={styles.actionButton}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentLikeSection;