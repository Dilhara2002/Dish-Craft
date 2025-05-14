// src/pages/Recipes.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        let url = 'http://localhost:8080/api/recipes';
        if (searchQuery) {
          url += `/search?query=${searchQuery}`;
        }
        const res = await axios.get(url);
        setRecipes(res.data);
      } catch (err) {
        console.error('Failed to fetch recipes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } catch (err) {
      console.error('Failed to delete recipe', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <input
          type="text"
          placeholder="Search recipes..."
          className="px-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe._id} 
            recipe={recipe} 
            onDelete={handleDelete}
            isOwner={user && user._id === recipe.userId}
          />
        ))}
      </div>
    </div>
  );
};

export default Recipes;