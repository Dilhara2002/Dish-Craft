import { Container, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Dish Craft
      </Typography>
      <Typography variant="body1">
        Discover and share amazing recipes with our community!
      </Typography>
    </Container>
  );
};

export default HomePage;