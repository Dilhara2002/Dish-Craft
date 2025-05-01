import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  TextField,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder, Comment, Share, MoreVert } from '@mui/icons-material';
import { getAllRecipes, searchRecipes, deleteRecipe } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';
import RecipeForm from './RecipeForm';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchRecipes(searchQuery);
      setRecipes(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id, user.id);
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search Recipes"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ width: '50%' }}
        />
        <Button 
          variant="contained" 
          onClick={() => setEditingRecipe({})}
        >
          Create Recipe
        </Button>
      </Box>

      {editingRecipe && (
        <RecipeForm 
          recipe={editingRecipe} 
          onClose={() => setEditingRecipe(null)} 
          onSuccess={fetchRecipes}
        />
      )}

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {recipe.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={recipe.imageUrl}
                  alt={recipe.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {recipe.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {recipe.tags?.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <IconButton aria-label="like">
                    <FavoriteBorder />
                  </IconButton>
                  <IconButton aria-label="comment">
                    <Comment />
                  </IconButton>
                  <IconButton aria-label="share">
                    <Share />
                  </IconButton>
                </Box>
                {user?.id === recipe.userId && (
                  <Box>
                    <IconButton 
                      aria-label="edit"
                      onClick={() => setEditingRecipe(recipe)}
                    >
                      <MoreVert />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeList;