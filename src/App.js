import React, { useEffect, useState } from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { Container } from '@mui/material';
  import NavBar from './components/NavBar';
  import LandingPage from './components/LandingPage';
  import About from './components/About';
  import OurTechnology from './components/OurTechnology';
  import Login from './components/Login';
  import QuestionCard from './components/QuestionCard';
  import { AuthProvider, AuthContext } from './components/AuthContext';
  import './App.css';
  import { API_BASE_URL } from './config/api';

  const Dashboard = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      fetch(`${API_BASE_URL}/api/companies/1/questions`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setQuestions(data))
        .catch(error => console.error('Error fetching questions:', error));
    }, []);

    return (
      <Container maxWidth="lg" sx={{ padding: '20px' }}>
        {questions.length === 0 ? (
          <p>No questions loaded. Check backend connection.</p>
        ) : (
          questions.map(question => (
            <QuestionCard
              key={question.id}
              title={question.title}
              summary={question.summary}
              dataConfidence={question.data_confidence}
              rankedList={[]}
              sampleReviews={{}}
              isComposite={['Removal Candidates', 'Feature Sentiment', 'Prioritization'].includes(question.title)}
            />
          ))
        )}
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
            <Route path="/about" element={<About />} />
            <Route path="/technology" element={<OurTechnology />} />
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
