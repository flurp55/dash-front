import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ mb: 4 }}>
        <img src="/assets/images/VoicePulseLogo.png" alt="VoicePulse Logo" style={{ width: '150px' }} />
      </Box>
      <Typography variant="h2" gutterBottom>
        Welcome to VoicePulse
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Empowering app developers with AI-driven insights to create better, user-focused applications.
      </Typography>
      <Typography variant="body1" paragraph>
        At VoicePulse, we harness cutting-edge AI tools to analyze user feedback, identify key issues, and prioritize improvements, ensuring your apps deliver exceptional experiences.
      </Typography>
      <Button variant="contained" color="primary" size="large" component={Link} to="/login">
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;