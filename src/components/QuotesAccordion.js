import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QuotesAccordion = ({ sampleReviews }) => {
  const [expanded, setExpanded] = useState({});
  
  const handleToggle = (feature) => {
    setExpanded((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <div>
      {Object.keys(sampleReviews).map((feature) => {
        const quotes = sampleReviews[feature];
        const displayQuotes = expanded[feature] ? quotes : quotes.slice(0, 2);
        
        return (
          <Accordion key={feature} style={{ marginBottom: '10px' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{feature.replace('_', ' ').toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {displayQuotes.length > 0 ? (
                <ul>
                  {displayQuotes.map((quote, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>{quote}</li>
                  ))}
                </ul>
              ) : (
                <Typography>No quotes available</Typography>
              )}
              {quotes.length > 2 && (
                <Button onClick={() => handleToggle(feature)}>
                  {expanded[feature] ? 'Show Less' : 'View More'}
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default QuotesAccordion;