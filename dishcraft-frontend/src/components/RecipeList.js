// src/components/RecipeForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState(['']);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/recipes/${id}`);
          const recipeData = response.data;
          setTitle(recipeData.title);
          setDescription(recipeData.description);
          setIngredients(recipeData.ingredients.length ? recipeData.ingredients : ['']);
          setInstructions(recipeData.instructions.length ? recipeData.instructions : ['']);
          setImageUrl(recipeData.imageUrl || '');
          setTags(recipeData.tags.length ? recipeData.tags : ['']);
        } catch (error) {
          console.error('Error fetching recipe for edit:', error);
          setError('Failed to load recipe for editing.');
        }
      };
      fetchRecipe();
    }
  }, [id]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const recipeData = {
      title,
      description,
      ingredients: ingredients.filter(ing => ing.trim() !== ''),
      instructions: instructions.filter(inst => inst.trim() !== ''),
      imageUrl: imageUrl.trim(),
      tags: tags.filter(tag => tag.trim() !== ''),
      userId
    };

    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/recipes/${id}`, recipeData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate(`/recipes/${id}`);
      } else {
        await axios.post('http://localhost:8080/api/recipes', recipeData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setError(error.response?.data?.message || 'Failed to save recipe.');
    }
  };

  return (
    <div className="recipe-form">
      <h2>{id ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <div key={`ingredient-${index}`} className="input-group">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              <button 
                type="button" 
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length <= 1}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="add-btn">
            Add Ingredient
          </button>
        </div>
        
        <div className="form-group">
          <label>Instructions:</label>
          {instructions.map((instruction, index) => (
            <div key={`instruction-${index}`} className="input-group">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
              />
              <button 
                type="button" 
                onClick={() => removeInstruction(index)}
                disabled={instructions.length <= 1}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} className="add-btn">
            Add Instruction
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Optional image URL"
          />
        </div>
        
        <div className="form-group">
          <label>Tags:</label>
          {tags.map((tag, index) => (
            <div key={`tag-${index}`} className="input-group">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                placeholder="e.g., vegetarian, quick-meal"
              />
              <button 
                type="button" 
                onClick={() => removeTag(index)}
                disabled={tags.length <= 1}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addTag} className="add-btn">
            Add Tag
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {id ? 'Update Recipe' : 'Save Recipe'}
          </button>
          <Link to={id ? `/recipes/${id}` : '/recipes'} className="cancel-btn">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;