import React from 'react';
import { Container, Typography } from '@mui/material';

const OurTechnology = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Our Technology
      </Typography>
      <Typography variant="body1" paragraph>
        VoicePulse leverages advanced AI-driven tools to transform how developers improve their applications. Our proprietary algorithms analyze user feedback, extracting key insights on features, issues, and sentiment.
      </Typography>
      <Typography variant="body1" paragraph>
        From identifying prevalent bugs to prioritizing feature requests, our technology provides clear, data-driven recommendations. We integrate with your existing workflows, offering real-time analytics and competitor comparisons to keep you ahead of the curve.
      </Typography>
    </Container>
  );
};

export default OurTechnology;