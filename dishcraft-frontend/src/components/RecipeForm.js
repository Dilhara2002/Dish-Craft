import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Chip,
  Box,
  IconButton,
  Typography
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { createRecipe, updateRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

const RecipeForm = ({ recipe, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || [''],
    instructions: recipe?.instructions || [''],
    imageUrl: recipe?.imageUrl || '',
    tags: recipe?.tags || []
  });
  const [newTag, setNewTag] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (name, index, value) => {
    const newArray = [...formData[name]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [name]: newArray
    });
  };

  const addArrayItem = (name) => {
    setFormData({
      ...formData,
      [name]: [...formData[name], '']
    });
  };

  const removeArrayItem = (name, index) => {
    const newArray = formData[name].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [name]: newArray
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tags: newTags
    });
  };

  const handleSubmit = async () => {
    try {
      if (recipe?.id) {
        await updateRecipe(recipe.id, formData, user.id);
      } else {
        await createRecipe(formData, user.id);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {recipe?.id ? 'Edit Recipe' : 'Create New Recipe'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredients
            </Typography>
            {formData.ingredients.map((ingredient, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  value={ingredient}
                  onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                  size="small"
                />
                {formData.ingredients.length > 1 && (
                  <Button onClick={() => removeArrayItem('ingredients', index)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button 
              startIcon={<Add />} 
              onClick={() => addArrayItem('ingredients')}
            >
              Add Ingredient
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Instructions
            </Typography>
            {formData.instructions.map((instruction, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  value={instruction}
                  onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                  multiline
                  rows={2}
                />
                {formData.instructions.length > 1 && (
                  <Button onClick={() => removeArrayItem('instructions', index)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button 
              startIcon={<Add />} 
              onClick={() => addArrayItem('instructions')}
            >
              Add Step
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {formData.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  onDelete={() => removeTag(index)} 
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex' }}>
              <TextField
                label="Add Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Button onClick={addTag}>Add</Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeForm;