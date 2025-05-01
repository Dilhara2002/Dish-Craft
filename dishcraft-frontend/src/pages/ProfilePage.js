import { Container, Typography, Avatar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Avatar 
          sx={{ width: 100, height: 100, mr: 3 }}
          src="https://randomuser.me/api/portraits/men/1.jpg"
        />
        <div>
          <Typography variant="h3">User Profile</Typography>
          <Typography variant="subtitle1">@{userId}</Typography>
          <Button variant="outlined" sx={{ mt: 1 }}>
            Follow
          </Button>
        </div>
      </div>
      <Typography variant="h5" gutterBottom>
        My Recipes
      </Typography>
      {/* Recipe list would go here */}
    </Container>
  );
};

export default ProfilePage;