// src/pages/RecipeListPage.js
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button } from '@mui/material';
import RecipeCard from '../pages/RecipeCard';


const RecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/recipes/search?query=${searchQuery}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', margin: '20px 0' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={handleSearch}
          style={{ marginLeft: '10px' }}
        >
          Search
        </Button>
      </div>
      
      <Grid container spacing={3}>
        {recipes.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecipeListPage;