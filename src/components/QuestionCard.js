// src/components/QuestionCard.js

import React, { useState, useEffect } from 'react';
import FeatureChart from './FeatureChart';
import QuotesAccordion from './QuotesAccordion';
import { API_BASE_URL } from '../config/api'; // Make sure path is correct

// The component now takes the basic question info as props
const QuestionCard = ({ id, title, summary, dataConfidence, isComposite }) => {
  const [rankedList, setRankedList] = useState([]);
  const [sampleReviews, setSampleReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This effect runs once for each QuestionCard when it mounts
    console.log(`QuestionCard ${id}: Fetching detailed data...`);

    fetch(`${API_BASE_URL}/api/questions/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Your backend wraps the response in a key like "question_1"
        const questionData = data[`question_${id}`];
        if (!questionData) {
          throw new Error("Data format from API is incorrect.");
        }

        console.log(`QuestionCard ${id}: Received data`, questionData);
        setRankedList(questionData.ranked_list || []);
        setSampleReviews(questionData.sample_reviews || {});
        setIsLoading(false);
      })
      .catch(err => {
        console.error(`Error fetching details for question ${id}:`, err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]); // Dependency array: re-run if the id prop ever changes

  // Filter out vague categories (this logic is the same as before)
  const filteredRankedList = rankedList.filter(([feature]) =>
    !['general_feature_request', 'general_issue', 'General User Feedback'].includes(feature)
  );

  const filteredSampleReviews = { ...sampleReviews };
  ['general_feature_request', 'general_issue', 'General User Feedback'].forEach(key => {
    delete filteredSampleReviews[key];
  });

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
      <h2>{title}</h2>
      {/* You can show a summary, confidence, etc. here */}

      {isLoading && <p>Loading chart data...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <>
          <FeatureChart
            rankedList={filteredRankedList}
            isComposite={isComposite || title === 'Feature Sentiment' || title === 'Prioritization'}
            chartLabel={''} // Your label logic here
            isSatisfaction={title === 'General App Satisfaction'}
          />
          <QuotesAccordion sampleReviews={filteredSampleReviews} />
        </>
      )}
    </div>
  );
};

export default QuestionCard;