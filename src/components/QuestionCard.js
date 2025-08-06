// src/components/QuestionCard.js

import React, { useState, useEffect, useRef } from 'react';
import FeatureChart from './FeatureChart';
import QuotesAccordion from './QuotesAccordion';
import { API_BASE_URL } from '../config/api';

// Cache to prevent duplicate requests for the same question
const requestCache = new Map();
const pendingRequests = new Map();

// Add global cache debugging
window.debugQuestionCache = () => {
  console.log('Current cache contents:', Array.from(requestCache.keys()));
  console.log('Current pending requests:', Array.from(pendingRequests.keys()));
};

const QuestionCard = ({ id, title, summary, dataConfidence, isComposite }) => {
  // VERY OBVIOUS TEST LOG
  console.log('🚨🚨🚨 QUESTIONCARD LOADING - ID:', id, 'TITLE:', title);
  
  const [rankedList, setRankedList] = useState([]);
  const [sampleReviews, setSampleReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // Add render logging
  console.log(`QuestionCard ${id} (${title}): Component rendering/re-rendering`);
  console.log(`QuestionCard ${id}: Current rankedList length:`, rankedList.length);
  console.log(`QuestionCard ${id}: Current sampleReviews keys:`, Object.keys(sampleReviews));

  useEffect(() => {
    // Component cleanup tracking
    mountedRef.current = true;
    
    const fetchData = async () => {
      console.log(`QuestionCard ${id}: Starting fetch (mounted: ${mountedRef.current})`);
      console.log(`QuestionCard ${id}: Cache status:`, requestCache.has(id) ? 'HIT' : 'MISS');
      console.log(`QuestionCard ${id}: Pending requests:`, Array.from(pendingRequests.keys()));
      
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
      console.log(`QuestionCard ${id}: Making new API request`);
      const requestPromise = fetch(`${API_BASE_URL}/api/questions/${id}`)
        .then(response => {
          console.log(`QuestionCard ${id}: Received response, status: ${response.status}`);
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
          console.log(`QuestionCard ${id}: Raw ranked_list:`, questionData.ranked_list);
          console.log(`QuestionCard ${id}: Ranked list length:`, questionData.ranked_list?.length);
          
          // Cache the data
          requestCache.set(id, questionData);
          console.log(`QuestionCard ${id}: Data cached. Cache now has:`, Array.from(requestCache.keys()));
          
          return questionData;
        })
        .finally(() => {
          // Clean up pending request
          pendingRequests.delete(id);
          console.log(`QuestionCard ${id}: Removed from pending requests`);
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

  // Filter out vague categories AND deduplicate
  const filteredRankedList = rankedList.filter(([feature]) =>
    !['general_feature_request', 'general_issue', 'General User Feedback'].includes(feature)
  );

  // Deduplicate the ranked list - combine duplicate features by summing their counts
  const deduplicatedRankedList = [];
  const featureMap = new Map();
  
  filteredRankedList.forEach(([feature, count]) => {
    if (featureMap.has(feature)) {
      // If feature already exists, add to the count
      featureMap.set(feature, featureMap.get(feature) + count);
    } else {
      // New feature
      featureMap.set(feature, count);
    }
  });
  
  // Convert back to array format and sort by count (descending)
  for (const [feature, count] of featureMap.entries()) {
    deduplicatedRankedList.push([feature, count]);
  }
  deduplicatedRankedList.sort((a, b) => b[1] - a[1]);

  console.log(`QuestionCard ${id}: Before deduplication:`, filteredRankedList.length, 'items');
  console.log(`QuestionCard ${id}: After deduplication:`, deduplicatedRankedList.length, 'items');
  if (filteredRankedList.length !== deduplicatedRankedList.length) {
    console.log(`QuestionCard ${id}: 🚨 FOUND DUPLICATES! Removed ${filteredRankedList.length - deduplicatedRankedList.length} duplicate entries`);
  }

  const filteredSampleReviews = { ...sampleReviews };
  ['general_feature_request', 'general_issue', 'General User Feedback'].forEach(key => {
    delete filteredSampleReviews[key];
  });

  // TEMPORARY TEST - hardcode data for question 1
  const testRankedList = id === 1 ? [["test_feature", 5]] : filteredRankedList;
  const testSampleReviews = id === 1 ? {"test_feature": ["test review"]} : filteredSampleReviews;

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
      <h2>{title} (ID: {id})</h2>
      
      {isLoading && <p>Loading chart data...</p>}
      {error && <p>Error: {error}</p>}
      {!isLoading && !error && (
        <>
          <FeatureChart
            rankedList={testRankedList}
            isComposite={isComposite || title === 'Feature Sentiment' || title === 'Prioritization'}
            chartLabel={''}
            isSatisfaction={title === 'General App Satisfaction'}
          />
          <QuotesAccordion sampleReviews={testSampleReviews} />
        </>
      )}
    </div>
  );
};

export default QuestionCard;