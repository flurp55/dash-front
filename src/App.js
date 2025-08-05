import React, { useEffect, useState } from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { Container } from '@mui/material';
  import NavBar from './components/NavBar';
  import LandingPage from './components/LandingPage';
  // import About from './components/About';
  // import OurTechnology from './components/OurTechnology';
  import Login from './components/Login';
  import QuestionCard from './components/QuestionCard';
  import { AuthProvider, AuthContext } from './components/AuthContext';
  import './App.css';
  import { API_BASE_URL } from './config/api';

const Dashboard = () => {
  const [questionsData, setQuestionsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Single API call to get all questions with their detailed data
    fetch(`${API_BASE_URL}/api/companies/1/questions-detailed`) // New endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received all questions data:', data);
        setQuestionsData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ padding: '20px' }}>
        <p>Loading questions...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ padding: '20px' }}>
        <p>Error: {error}</p>
      </Container>
    );
  }

  const questions = Object.values(questionsData);

  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      {questions.map(question => (
        <QuestionCard
          key={question.id}
          id={question.id}
          title={question.title}
          summary={question.summary}
          dataConfidence={question.data_confidence}
          isComposite={['Removal Candidates', 'Feature Sentiment', 'Prioritization'].includes(question.title)}
          // Pass the detailed data directly as props
          rankedList={question.ranked_list || []}
          sampleReviews={question.sample_reviews || {}}
        />
      ))}
    </Container>
  );
};

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const App = () => {
    return (
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/technology" element={<OurTechnology />} /> */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    );
  };

  export default App;
