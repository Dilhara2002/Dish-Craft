import { Container, Typography, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create an Account
      </Typography>
      <form>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </form>
      <Typography>
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">
          Login here
        </Link>
      </Typography>
    </Container>
  );
};

export default RegisterPage;