import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 0, mr: 2 }}>
          <img src="/assets/images/VoicePulseLogo.png" alt="VoicePulse Logo" style={{ height: '40px' }} />
        </Box>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
          VoicePulse
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        {/* <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/technology">Our Technology</Button> */}
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;