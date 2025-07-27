import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        About VoicePulse
      </Typography>
      <Typography variant="body1" paragraph>
        VoicePulse is dedicated to revolutionizing app development through AI-driven insights. Our mission is to help developers understand user needs, identify pain points, and prioritize features that matter most.
      </Typography>
      <Typography variant="body1" paragraph>
        Founded by a team of innovators, we combine expertise in artificial intelligence, data analytics, and user experience to empower developers worldwide. Our tools analyze millions of user reviews to provide actionable insights, making your apps better, faster.
      </Typography>
    </Container>
  );
};

export default About;