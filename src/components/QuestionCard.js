// src/components/QuestionCard.js

import React, { useState, useEffect, useRef } from 'react';
import FeatureChart from './FeatureChart';
import QuotesAccordion from './QuotesAccordion';
import { API_BASE_URL } from '../config/api';

// Cache to prevent duplicate requests for the same question
const requestCache = new Map();
const pendingRequests = new Map();

const QuestionCard = ({ id, title, summary, dataConfidence, isComposite }) => {
  const [rankedList, setRankedList] = useState([]);
  const [sampleReviews, setSampleReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Component cleanup tracking
    mountedRef.current = true;
    
    const fetchData = async () => {
      console.log(`QuestionCard ${id}: Starting fetch (mounted: ${mountedRef.current})`);
      
      // Check cache first
      if (requestCache.has(id)) {
        console.log(`QuestionCard ${id}: Using cached data`);
        const cachedData = requestCache.get(id);
        if (mountedRef.current) {
          setRankedList(cachedData.ranked_list || []);
          setSampleReviews(cachedData.sample_reviews || {});
          setIsLoading(false);
        }
        return;
      }

      // Check if request is already pending
      if (pendingRequests.has(id)) {
        console.log(`QuestionCard ${id}: Waiting for pending request`);
        try {
          const data = await pendingRequests.get(id);
          if (mountedRef.current) {
            setRankedList(data.ranked_list || []);
            setSampleReviews(data.sample_reviews || {});
            setIsLoading(false);
          }
        } catch (err) {
          if (mountedRef.current) {
            setError(err.message);
            setIsLoading(false);
          }
        }
        return;
      }

      // Create new request
      const requestPromise = fetch(`${API_BASE_URL}/api/questions/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const questionData = data[`question_${id}`];
          if (!questionData) {
            throw new Error("Data format from API is incorrect.");
          }
          
          console.log(`QuestionCard ${id}: Received fresh data`, questionData);
          
          // Cache the data
          requestCache.set(id, questionData);
          
          return questionData;
        })
        .finally(() => {
          // Clean up pending request
          pendingRequests.delete(id);
        });

      // Store the pending request
      pendingRequests.set(id, requestPromise);

      try {
        const questionData = await requestPromise;
        
        if (mountedRef.current) {
          setRankedList(questionData.ranked_list || []);
          setSampleReviews(questionData.sample_reviews || {});
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching details for question ${id}:`, err);
        if (mountedRef.current) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  // Filter out vague categories
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
      
      {isLoading && <p>Loading chart data...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <>
          <FeatureChart
            rankedList={filteredRankedList}
            isComposite={isComposite || title === 'Feature Sentiment' || title === 'Prioritization'}
            chartLabel={''}
            isSatisfaction={title === 'General App Satisfaction'}
          />
          <QuotesAccordion sampleReviews={filteredSampleReviews} />
        </>
      )}
    </div>
  );
};

export default QuestionCard;