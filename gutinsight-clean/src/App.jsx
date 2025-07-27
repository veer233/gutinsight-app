import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import Payment from './components/Payment';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    const savedResponses = localStorage.getItem('userResponses');
    const savedPaymentStatus = localStorage.getItem('paymentStatus');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedResponses) {
      setUserResponses(JSON.parse(savedResponses));
    }
    if (savedPaymentStatus) {
      setPaymentStatus(JSON.parse(savedPaymentStatus));
    }
  }, []);

  const handleUserRegistration = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleQuestionnaireComplete = (responses) => {
    setUserResponses(responses);
    localStorage.setItem('userResponses', JSON.stringify(responses));
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus(true);
    localStorage.setItem('paymentStatus', JSON.stringify(true));
    
    // Update user payment status
    if (currentUser) {
      const updatedUser = { ...currentUser, has_paid: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onUserRegistration={handleUserRegistration}
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/questionnaire" 
            element={
              <Questionnaire 
                currentUser={currentUser}
                onComplete={handleQuestionnaireComplete}
                userResponses={userResponses}
              />
            } 
          />
          <Route 
            path="/payment" 
            element={
              <Payment 
                currentUser={currentUser}
                userResponses={userResponses}
                onPaymentSuccess={handlePaymentSuccess}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <Results 
                currentUser={currentUser}
                userResponses={userResponses}
                paymentStatus={paymentStatus}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={<AdminPanel />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

