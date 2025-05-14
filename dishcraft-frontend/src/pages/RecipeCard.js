// src/components/RecipeCard.js
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      {recipe.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={recipe.imageUrl}
          alt={recipe.title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.description?.substring(0, 100)}...
        </Typography>
        <Button 
          size="small" 
          onClick={() => navigate(`/recipes/${recipe.id}`)}
          sx={{ mt: 2 }}
        >
          View Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;