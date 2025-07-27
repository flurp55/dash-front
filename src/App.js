import React, { useEffect, useState } from 'react';
import QuestionCard from './components/QuestionCard';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionData, setQuestionData] = useState({});

  useEffect(() => {
    // Fetch all questions for company (e.g., Nike, company_id = 1)
    fetch('http://localhost:5000/api/companies/1/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        // Fetch detailed data for each question
        data.forEach(q => {
          fetch(`http://localhost:5000/api/questions/${q.id}`)
            .then(res => res.json())
            .then(detail => {
              setQuestionData(prev => ({
                ...prev,
                [q.id]: detail[`question_${q.id}`]
              }));
            });
        });
      });
  }, []);

  return (
    <div className="App">
      <h1>Review Insights Dashboard</h1>
      {questions.length > 0 ? (
        questions.map(q => (
          questionData[q.id] && (
            <QuestionCard
              key={q.id}
              title={q.title}
              summary={questionData[q.id].summary}
              rankedList={questionData[q.id].ranked_list}
              sampleReviews={questionData[q.id].sample_reviews}
              dataConfidence={questionData[q.id].data_confidence}
              isComposite={q.title === 'Removal Candidates'}
            />
          )
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;