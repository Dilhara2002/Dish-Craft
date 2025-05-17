import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const payload = {
        title: form.title,
        description: form.description,
        ingredients: form.ingredients
          .split('\n')
          .map(i => i.trim())
          .filter(i => i),
        instructions: form.instructions
          ? form.instructions
              .split('\n')
              .map(step => step.trim())
              .filter(step => step)
          : [],
        imageUrl: form.imageUrl
      };

      await axios.post('http://localhost:8080/api/recipes', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: localStorage.getItem('userId'),
          host: window.location.origin
        }
      });

      alert('Recipe added successfully!');
      navigate('/recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title*</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description*</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>

        {/* Ingredients */}
        <div className="mb-3">
          <label htmlFor="ingredients" className="form-label">
            Ingredients* (one per line)
          </label>
          <textarea
            className="form-control"
            id="ingredients"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Enter each ingredient on a new line"
          />
        </div>

        {/* Instructions */}
        <div className="mb-3">
          <label htmlFor="instructions" className="form-label">
            Instructions* (one step per line)
          </label>
          <textarea
            className="form-control"
            id="instructions"
            name="instructions"
            value={form.instructions || ''}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Enter each instruction step on a new line"
          />
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;