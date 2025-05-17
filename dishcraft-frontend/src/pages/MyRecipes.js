import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setError('User ID not found. Please login again.');
      setIsLoading(false);
      return;
    }

    axios.get(`http://localhost:8080/api/recipes/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setMyRecipes(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Error fetching user recipes:', err);
      setError('Failed to load recipes. Please try again later.');
      setIsLoading(false);
    });
  }, []);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '20px'
      }}>
        <h2 style={{
          color: '#2c3e50',
          fontSize: '28px',
          fontWeight: '600',
          margin: '0'
        }}></h2>
        <Link 
          to="/add" 
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            ':hover': {
              backgroundColor: '#218838',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Add New Recipe
        </Link>
      </div>

      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <div style={{
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      ) : error ? (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      ) : myRecipes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>No Recipes Found</h3>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>You haven't added any recipes yet.</p>
          <Link 
            to="/add" 
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Create Your First Recipe
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          padding: '10px'
        }}>
          {myRecipes.map((recipe, index) => (
            <div 
              key={recipe.id || index} 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              {recipe.imageUrl && (
                <div style={{
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      ':hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </div>
              )}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {recipe.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  marginBottom: '15px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {recipe.description?.substring(0, 100)}...
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Link 
                    to={`/MyRecipes/${recipe.id}`}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease',
                      ':hover': {
                        backgroundColor: '#0056b3'
                      }
                    }}
                  >
                    View Details
                  </Link>
                  <span style={{
                    fontSize: '12px',
                    color: '#95a5a6'
                  }}>
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MyRecipes;