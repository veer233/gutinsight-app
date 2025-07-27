import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Questionnaire from './components/Questionnaire'
import Payment from './components/Payment'
import Results from './components/Results'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  const [userResponses, setUserResponses] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            } 
          />
          <Route 
            path="/questionnaire" 
            element={
              <Questionnaire 
                userResponses={userResponses}
                setUserResponses={setUserResponses}
                currentUser={currentUser}
              />
            } 
          />
          <Route 
            path="/payment" 
            element={
              <Payment 
                userResponses={userResponses}
                currentUser={currentUser}
                setPaymentStatus={setPaymentStatus}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <Results 
                userResponses={userResponses}
                currentUser={currentUser}
                paymentStatus={paymentStatus}
              />
            } 
          />
          <Route 
            path="/admin" 
            element={<AdminPanel />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

