import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Box, 
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Favorite, FavoriteBorder, Comment, Share } from '@mui/icons-material';
import { getRecipeById } from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        {recipe.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={recipe.imageUrl}
            alt={recipe.title}
          />
        )}
        <CardContent>
          <Typography variant="h3" gutterBottom>
            {recipe.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {recipe.description}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            {recipe.tags?.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>

          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <List>
            {recipe.ingredients?.map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" gutterBottom>
            Instructions
          </Typography>
          <List>
            {recipe.instructions?.map((instruction, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`Step ${index + 1}`} 
                  secondary={instruction} 
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', mt: 3 }}>
            <Button 
              startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
              onClick={() => setIsLiked(!isLiked)}
              sx={{ mr: 2 }}
            >
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button startIcon={<Comment />} sx={{ mr: 2 }}>
              Comment
            </Button>
            <Button startIcon={<Share />}>
              Share
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetail;