import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  IconButton,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Search, 
  FavoriteBorder, 
  Favorite, 
  ChatBubbleOutline, 
  Share, 
  BookmarkBorder,
  MoreVert,
  AddCircleOutline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

// Sample data for demonstration
const trendingRecipes = [
  {
    id: 1,
    title: "Spicy Thai Basil Chicken",
    author: "ChefMaster22",
    likes: 245,
    comments: 32,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    title: "Vegan Chocolate Avocado Mousse",
    author: "GreenEats",
    likes: 189,
    comments: 24,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const popularGroups = [
  { name: "Vegan Chefs United", members: 1243 },
  { name: "Italian Cuisine Lovers", members: 982 },
  { name: "Baking Enthusiasts", members: 756 }
];

// Custom styled components
const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: '50px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}));

const RecipeCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const HomePage = () => {
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        borderRadius: '16px',
        p: 4,
        color: 'white'
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to Dish Craft
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Share your culinary creations and discover amazing recipes
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{ 
            borderRadius: '50px',
            px: 4,
            py: 1.5,
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
          startIcon={<AddCircleOutline />}
        >
          Create Post
        </Button>
      </Box>

      {/* Search Bar */}
      <SearchBar>
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search recipes, chefs, or groups..."
        />
      </SearchBar>

      <Grid container spacing={4}>
        {/* Main Content - Posts */}
        <Grid item xs={12} md={8}>
          {/* Create Post Card */}
          <RecipeCard>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                src="https://randomuser.me/api/portraits/men/1.jpg" 
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <InputBase
                  fullWidth
                  placeholder="What's cooking today?"
                  sx={{
                    p: 1,
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#ddd'
                    }
                  }}
                />
              </Box>
            </CardContent>
            <Divider />
            <Box sx={{ display: 'flex', p: 1 }}>
              <Button startIcon={<AddCircleOutline />} sx={{ flexGrow: 1 }}>
                Add Photo/Video
              </Button>
              <Button startIcon={<AddCircleOutline />} sx={{ flexGrow: 1 }}>
                Add Recipe
              </Button>
            </Box>
          </RecipeCard>

          {/* Trending Recipes */}
          {trendingRecipes.map(recipe => (
            <RecipeCard key={recipe.id}>
              <CardMedia
                component="img"
                height="240"
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={recipe.avatar} sx={{ mr: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {recipe.author}
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {recipe.title}
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <Chip label="Dinner" size="small" sx={{ mr: 1 }} />
                  <Chip label="Spicy" size="small" sx={{ mr: 1 }} />
                  <Chip label="Asian" size="small" />
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ display: 'flex', p: 1 }}>
                <IconButton 
                  aria-label="like" 
                  onClick={() => toggleLike(recipe.id)}
                  sx={{ color: likedPosts.includes(recipe.id) ? 'red' : 'inherit' }}
                >
                  {likedPosts.includes(recipe.id) ? <Favorite /> : <FavoriteBorder />}
                  <Typography sx={{ ml: 1 }}>{recipe.likes + (likedPosts.includes(recipe.id) ? 1 : 0)}</Typography>
                </IconButton>
                <IconButton aria-label="comment">
                  <ChatBubbleOutline />
                  <Typography sx={{ ml: 1 }}>{recipe.comments}</Typography>
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton aria-label="save">
                  <BookmarkBorder />
                </IconButton>
              </Box>
            </RecipeCard>
          ))}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Popular Groups */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Popular Groups
            </Typography>
            {popularGroups.map((group, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1.5,
                borderBottom: index < popularGroups.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <Typography>{group.name}</Typography>
                <Button variant="outlined" size="small">
                  Join
                </Button>
              </Box>
            ))}
            <Button fullWidth sx={{ mt: 2 }}>See All Groups</Button>
          </Paper>

          {/* Suggested Chefs */}
          <Paper sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Suggested Chefs
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src="https://randomuser.me/api/portraits/women/12.jpg" sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>ChefMaria</Typography>
                <Typography variant="body2" color="text.secondary">Italian Cuisine</Typography>
              </Box>
              <Button size="small" variant="contained">Follow</Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src="https://randomuser.me/api/portraits/men/41.jpg" sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>BakingPro</Typography>
                <Typography variant="body2" color="text.secondary">Pastry Chef</Typography>
              </Box>
              <Button size="small" variant="contained">Follow</Button>
            </Box>
            <Button fullWidth sx={{ mt: 1 }}>View All</Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;