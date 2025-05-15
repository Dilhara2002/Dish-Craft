import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RecipeForm = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    imageUrl: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/recipes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setRecipe(res.data);
        } catch (err) {
          setError('Failed to load recipe for editing.');
        }
      };
      fetchRecipe();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ''] });
  };

  const removeInstruction = (index) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
      setRecipe({ ...recipe, tags: [...recipe.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setRecipe({ ...recipe, tags: recipe.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/recipes/${id}`, recipe, {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId
          }
        });
      } else {
        await axios.post('http://localhost:8080/api/recipes', {
          ...recipe,
          userId: userId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/recipes');
    } catch (err) {
      setError(id ? 'Failed to update recipe.' : 'Failed to create recipe.');
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>{id ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      
      {error && <p style={errorStyle}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} style={arrayItemStyle}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                required
                style={arrayInputStyle}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length <= 1}
                style={removeButtonStyle}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            style={addButtonStyle}
          >
            Add Ingredient
          </button>
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Instructions</label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} style={arrayItemStyle}>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                required
                style={arrayTextareaStyle}
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                disabled={recipe.instructions.length <= 1}
                style={removeButtonStyle}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            style={addButtonStyle}
          >
            Add Instruction
          </button>
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Tags</label>
          <div style={tagInputContainerStyle}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              style={tagInputStyle}
            />
            <button
              type="button"
              onClick={addTag}
              style={tagAddButtonStyle}
            >
              Add Tag
            </button>
          </div>
          <div style={tagContainerStyle}>
            {recipe.tags.map((tag, index) => (
              <span key={index} style={tagStyle}>
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={tagRemoveStyle}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={submitButtonStyle}
        >
          {loading ? 'Processing...' : (id ? 'Update Recipe' : 'Save Recipe')}
        </button>
        
        
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '30px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const headingStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px',
};

const errorStyle = {
  color: '#dc3545',
  textAlign: 'center',
  marginBottom: '20px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const formGroupStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  minHeight: '100px',
  resize: 'vertical',
};

const arrayItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const arrayInputStyle = {
  flex: 1,
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const arrayTextareaStyle = {
  flex: 1,
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  minHeight: '80px',
  resize: 'vertical',
};

const removeButtonStyle = {
  marginLeft: '10px',
  padding: '10px 15px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const addButtonStyle = {
  padding: '10px 15px',
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
};

const tagInputContainerStyle = {
  display: 'flex',
  marginBottom: '10px',
};

const tagInputStyle = {
  flex: 1,
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const tagAddButtonStyle = {
  marginLeft: '10px',
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const tagContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

const tagStyle = {
  backgroundColor: '#e0e0e0',
  padding: '5px 15px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
};

const tagRemoveStyle = {
  marginLeft: '8px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#888',
  cursor: 'pointer',
  fontSize: '1rem',
};

const submitButtonStyle = {
  padding: '12px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginBottom: '15px',
};

const cancelButtonStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '10px',
  color: '#6c757d',
  textDecoration: 'none',
};

export default RecipeForm;