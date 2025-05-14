// src/components/RecipeForm.js
import { useState } from 'react';

const RecipeForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    ingredients: initialData.ingredients || [''],
    instructions: initialData.instructions || [''],
    imageUrl: initialData.imageUrl || '',
    tags: initialData.tags?.join(', ') || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    onSubmit({
      ...formData,
      tags: tagsArray
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Title*</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients*</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
              required
              className="flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('ingredients', index)}
              className="bg-red-500 text-white px-3 rounded"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('ingredients')}
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add Ingredient
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Instructions*</label>
        {formData.instructions.map((step, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <textarea
              value={step}
              onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
              required
              className="flex-1 border rounded p-2"
              rows="2"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('instructions', index)}
              className="bg-red-500 text-white px-3 rounded self-start"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('instructions')}
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add Step
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {initialData._id ? 'Update Recipe' : 'Create Recipe'}
      </button>
    </form>
  );
};

export default RecipeForm;