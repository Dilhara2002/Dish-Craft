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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Latest Recipes</h1>
      {loading ? (
        <p className="text-gray-500">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid gap-6">
          {recipes.map((recipe) => (
            <PostCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
