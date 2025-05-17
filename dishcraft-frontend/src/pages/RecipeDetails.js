import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8080/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      color: '#666'
    }}>
      Loading recipe...
    </div>
  );

  if (!recipe) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      color: '#dc3545'
    }}>
      Recipe not found.
    </div>
  );

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem'
      }}>
        <h2 style={{
          color: '#333',
          fontSize: '2rem',
          fontWeight: '600',
          margin: 0
        }}>
          {recipe.title}
        </h2>
        
      </div>

      {recipe.imageUrl && (
        <div style={{
          marginBottom: '2rem',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'cover',
              display: 'block'
            }} 
          />
        </div>
      )}

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: '#333',
          margin: 0
        }}>
          {recipe.description}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h4 style={{
            color: '#333',
            fontSize: '1.3rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #17a2b8'
          }}>
            Ingredients
          </h4>
          <ul style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }}>
            {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#17a2b8',
                  borderRadius: '50%',
                  marginRight: '0.5rem'
                }}></span>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{
            color: '#333',
            fontSize: '1.3rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #dc3545'
          }}>
            Steps
          </h4>
          <ol style={{
            paddingLeft: '1.5rem',
            margin: 0
          }}>
            {recipe.instructions && recipe.instructions.map((step, idx) => (
              <li key={idx} style={{
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                lineHeight: '1.6'
              }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '2rem'
      }}>
        <Link 
          to="/recipes" 
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: '#5a6268',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Back to All Recipes
        </Link>
      </div>
    </div>
  );
};

export default RecipeDetails;