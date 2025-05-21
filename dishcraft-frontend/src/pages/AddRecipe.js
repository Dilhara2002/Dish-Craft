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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setShowSuccessModal(true);
    } catch (error) {
      setIsUploading(false);
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/recipes');
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Success!</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseSuccessModal}></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#28a745" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </div>
                <h4 className="mb-3">Recipe Added Successfully!</h4>
                <p>Your new recipe has been saved and is now available.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button type="button" className="btn btn-success" onClick={handleCloseSuccessModal}>
                  Continue to Recipes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRecipe;