// src/pages/RecipeDetail.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error('Failed to fetch recipe', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`);
      navigate('/recipes');
    } catch (err) {
      console.error('Failed to delete recipe', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            {recipe.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {user && user._id === recipe.userId && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/recipes/${id}/edit`)}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {recipe.imageUrl && (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{recipe.description || 'No description provided.'}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex">
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;