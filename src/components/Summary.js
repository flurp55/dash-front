import React from 'react';
import { Chip } from '@mui/material';

const Summary = ({ text, confidence }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p>{text}</p>
      <Chip label={`Confidence: ${confidence}`} color={confidence === 'HIGH' ? 'success' : 'default'} />
    </div>
  );
};

export default Summary;