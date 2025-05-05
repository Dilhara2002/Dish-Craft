import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('/api/recipes');
        setRecipes(res.data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div style={{
      maxWidth: '56rem',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      backgroundColor: '#f8fafc'
    }}>
      <h1 style={{
        fontSize: '1.875rem',
        lineHeight: '2.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: '#1e293b',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Latest Recipes
      </h1>
      {loading ? (
        <p style={{
          color: '#64748b',
          fontSize: '1rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          Loading recipes...
        </p>
      ) : recipes.length === 0 ? (
        <p style={{
          color: '#64748b',
          fontSize: '1rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          No recipes found.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}>
          {recipes.map((recipe) => (
            <PostCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;