import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store the base64 encoded image directly in the form state
        setForm({ ...form, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      setIsUploading(true);
      
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
        imageUrl: form.imageUrl // This already contains the base64 data if an image was uploaded
      };
      
      await axios.post('http://localhost:8080/api/recipes', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: localStorage.getItem('userId'),
          host: window.location.origin
        }
      });
      
      setIsUploading(false);
      alert('Recipe added successfully!');
      navigate('/recipes');
    } catch (error) {
      setIsUploading(false);
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
          <label className="form-label">Title</label>
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
          <label className="form-label">Description</label>
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
            Ingredients (one per line)
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
            Instructions (one step per line)
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
        
        {/* Image Upload Section */}
        <div className="mb-3">
          <label className="form-label">Recipe Image</label>
          <div className="card p-3">
            <div className="mb-3">
              <label htmlFor="imageUpload" className="form-label">Upload an image</label>
              <input
                id="imageUpload"
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              {imagePreview && (
                <div className="mt-3">
                  <p>Image Preview:</p>
                  <div className="mt-2" style={{ maxWidth: '300px' }}>
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="img-fluid rounded"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Or provide an image URL</label>
              <input
                type="text"
                className="form-control"
                name="imageUrl"
                value={form.imageUrl && !form.imageUrl.startsWith('data:') ? form.imageUrl : ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={form.imageUrl && form.imageUrl.startsWith('data:')}
              />
              
              {form.imageUrl && !form.imageUrl.startsWith('data:') && (
                <div className="mt-2">
                  <p>URL Preview:</p>
                  <div style={{ maxWidth: '300px' }}>
                    <img
                      src={form.imageUrl}
                      alt="Recipe preview"
                      className="img-fluid rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        alert('Error loading image from URL. Please check the URL.');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <small className="text-muted">
            You can either upload an image file or provide an image URL.
          </small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isUploading}
        >
          {isUploading ? 'Saving Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;