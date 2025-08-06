// src/App.js

import React, { useEffect, useState, useContext } from 'react'; // Added useContext
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
// Import both the component and the new cleanup function
import QuestionCard, { clearQuestionCardCache } from './components/QuestionCard';
import { AuthProvider, AuthContext } from './components/AuthContext';
import './App.css';
import { API_BASE_URL } from './config/api';

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // This part remains the same, fetching the list of questions
    fetch(`${API_BASE_URL}/api/companies/1/questions`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));

    // THE FIX: Return a cleanup function from the effect.
    // This function will automatically run when the Dashboard component is unmounted
    // (i.e., when the user navigates to a different page).
    return () => {
      clearQuestionCardCache();
    };
  }, []); // The empty dependency array [] is crucial. It means this effect runs only on mount and unmount.

  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        // This part remains the same
        questions.map(question => (
          <QuestionCard
            key={question.id}
            id={question.id}
            title={question.title}
            summary={question.summary}
            dataConfidence={question.data_confidence}
            isComposite={['Removal Candidates', 'Feature Sentiment', 'Prioritization'].includes(question.title)}
          />
        ))
      )}
    </Container>
  );
};

const ProtectedRoute = ({ children }) => {
  // Switched to use useContext directly for consistency
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
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