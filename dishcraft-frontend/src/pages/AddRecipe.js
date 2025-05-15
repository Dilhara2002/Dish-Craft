import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
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
        ingredients: form.ingredients.split(',').map(i => i.trim()),
        steps: form.steps.split('.').map(s => s.trim()).filter(s => s),
        imageUrl: form.imageUrl
      };

      await axios.post('http://localhost:8080/api/recipes', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Recipe added successfully!');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        {['title', 'description', 'ingredients', 'steps', 'imageUrl'].map((field, index) => (
          <div className="mb-3" key={index}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            {field === 'description' ? (
              <textarea
                className="form-control"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={field !== 'imageUrl'}
              />
            ) : (
              <input
                type="text"
                className="form-control"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={field !== 'imageUrl'}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
