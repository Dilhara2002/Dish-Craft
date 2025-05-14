import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeForm from './RecipeForm';

const RecipeList = ({ token }) => {
  const [recipes, setRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const endpoint = myRecipes ? '/api/recipes/my' : '/api/recipes';
      const res = await axios.get(`http://localhost:8080${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/recipes/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [myRecipes]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Recipes</h2>
      <div className="mb-3">
        <input className="form-control" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={searchRecipes} className="btn btn-sm btn-primary mt-1">Search</button>
        <button onClick={() => setMyRecipes(!myRecipes)} className="btn btn-sm btn-secondary mt-1 ms-2">
          {myRecipes ? 'Show All' : 'Show My Recipes'}
        </button>
      </div>
      <ul className="list-group">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="list-group-item">
            <h5>{recipe.title}</h5>
            <p>{recipe.description}</p>
            <img src={recipe.imageUrl} alt="recipe" style={{ maxWidth: 100 }} />
            <div className="mt-2">
              <button className="btn btn-sm btn-warning me-2" onClick={() => setSelectedRecipe(recipe)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <hr />
      <RecipeForm token={token} selectedRecipe={selectedRecipe} onSave={fetchRecipes} />
    </div>
  );
};

export default RecipeList;

