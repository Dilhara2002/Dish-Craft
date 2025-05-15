import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    cookingTime: '',
    servings: '',
    category: '',
    imageUrl: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index) => {
    if (recipe.ingredients.length > 1) {
      const newIngredients = [...recipe.ingredients];
      newIngredients.splice(index, 1);
      setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const addInstruction = () => {
    setRecipe(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (index) => {
    if (recipe.instructions.length > 1) {
      const newInstructions = [...recipe.instructions];
      newInstructions.splice(index, 1);
      setRecipe(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredIngredients = recipe.ingredients.filter(i => i.trim() !== '');
    const filteredInstructions = recipe.instructions.filter(i => i.trim() !== '');

    const recipeData = {
      ...recipe,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prepTime: parseInt(recipe.prepTime) || 0,
      cookingTime: parseInt(recipe.cookingTime) || 0,
      servings: parseInt(recipe.servings) || 0
    };

    try {
      setLoading(true);
      setError('');

      await axios.post('http://localhost:8080/api/recipes', recipeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Recipe added successfully!');
      navigate('/recipes');
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.response?.data?.message || 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Add New Recipe</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title*</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={recipe.title}
                onChange={handleChange}
                required
                placeholder="Recipe title"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description*</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={recipe.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Brief description of your recipe"
              ></textarea>
            </div>

            {/* Time & Category */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label htmlFor="prepTime" className="form-label">Prep Time (mins)</label>
                <input
                  type="number"
                  className="form-control"
                  id="prepTime"
                  name="prepTime"
                  value={recipe.prepTime}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="cookingTime" className="form-label">Cooking Time (mins)</label>
                <input
                  type="number"
                  className="form-control"
                  id="cookingTime"
                  name="cookingTime"
                  value={recipe.cookingTime}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="servings" className="form-label">Servings</label>
                <input
                  type="number"
                  className="form-control"
                  id="servings"
                  name="servings"
                  value={recipe.servings}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={recipe.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Image */}
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                id="imageUrl"
                name="imageUrl"
                value={recipe.imageUrl}
                onChange={handleChange}
              />
              {recipe.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={recipe.imageUrl}
                    alt="Recipe Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>Ingredients*</span>
                <button type="button" className="btn btn-sm btn-success" onClick={addIngredient}>
                  <i className="bi bi-plus-circle me-1"></i>Add Ingredient
                </button>
              </label>
              {recipe.ingredients.map((ingredient, index) => (
                <div className="input-group mb-2" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    required={index === 0}
                    placeholder="e.g. 1 cup flour"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeIngredient(index)}
                    disabled={recipe.ingredients.length === 1}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mb-3">
              <label className="form-label d-flex justify-content-between align-items-center">
                <span>Instructions*</span>
                <button type="button" className="btn btn-sm btn-success" onClick={addInstruction}>
                  <i className="bi bi-plus-circle me-1"></i>Add Step
                </button>
              </label>
              {recipe.instructions.map((instruction, index) => (
                <div className="input-group mb-2" key={index}>
                  <span className="input-group-text">Step {index + 1}</span>
                  <textarea
                    className="form-control"
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required={index === 0}
                    rows="2"
                    placeholder="Describe this step"
                  ></textarea>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeInstruction(index)}
                    disabled={recipe.instructions.length === 1}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                value={recipe.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional tips, variations, etc."
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/recipes')}>
                <i className="bi bi-x-circle me-1"></i>Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>Save Recipe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
