import React from 'react';
import Summary from './Summary';
import FeatureChart from './FeatureChart';
import QuotesAccordion from './QuotesAccordion';

const QuestionCard = ({ title, summary, rankedList, sampleReviews, dataConfidence, isComposite }) => {
  // Define chart label based on question title
  const chartLabel = {
    'Features Mentioned Most': 'Feature Mention Counts',
    'Top Missing Features': 'Missing Feature Requests',
    'Features Requested Most': 'Feature Request Counts',
    'Removal Candidates': 'Feature Removal Scores',
    'Prevalent Issues': 'Bug/Issue Reports',
    'Prioritization': 'Priority Scores',
    'Important Features to Fix': 'Feature Fix Requests',
    'Feature Sentiment': 'Feature Sentiment Scores',
    'Least Liked Features': 'Negative Sentiment Counts',
    'Competitor Comparisons': 'Competitor Comparison Counts',
    'General App Satisfaction': 'Satisfaction Distribution',
    'Competitor Features Missing': 'Missing Competitor Features',
    'Competitor Advantages': 'Competitor Advantage Counts'
  }[title] || 'Feature Analysis';

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
      {/* <Summary text={summary} confidence={dataConfidence} /> */}
      <FeatureChart 
        rankedList={filteredRankedList} 
        isComposite={isComposite || title === 'Feature Sentiment' || title === 'Prioritization'} 
        chartLabel={chartLabel} 
        isSatisfaction={title === 'General App Satisfaction'}
      />
      <QuotesAccordion sampleReviews={filteredSampleReviews} />
    </div>
  );
};

export default QuestionCard;