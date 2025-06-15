import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import Dashboard from './Components/Dashboard';
import CreateQuiz from './Components/CreateQuiz';
import QandA from './Components/QandA';
import PollType from './Components/PollType';
import PollQuizInterface from './Components/PollQuizInterface';
import ThanksMessagePoll from './Components/ThanksMessagePoll';
import Analytics from './Components/Analytics';
import QandAQuizInterface from './Components/QandAQuizInterface';
import ScoreQandA from './Components/ScoreQandA';
import QandAQuestionAnalysis from "./Components/QandAQuestionAnalysis"
import PollQuestionAnalysis from './Components/PollQuestionAnalysis';
import DeleteQuiz from './Components/DeleteQuiz';
import ForgotPassword from './Components/ForgotPassword';
import PageNotFound from './Components/PageNotFound';
import Swal from 'sweetalert2';


const ProtectedRoute = ({children}) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if(!user || !token) {
    Swal.fire({
      title: 'Access Denied',
      text: 'Please Login to access this Page',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return <Navigate to="/" replace />
  }
  return children;
}

function App() {

  return (
   <>
   <Router>
    <Routes>
      <Route path='/' element={<HomePage />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/forgot-password' element={<ForgotPassword />}/>


      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard /> 
          </ProtectedRoute>
        }/>

      <Route path='/create-quiz' element={
        <ProtectedRoute>
        <CreateQuiz />
        </ProtectedRoute>
      }/>

      <Route path='/qanda' element={
        <ProtectedRoute>
        <QandA />
        </ProtectedRoute>
      }/>

      <Route path='/polltype' element={
        <ProtectedRoute>
        <PollType />
        </ProtectedRoute>
      }/>

 <Route path='/analytics' element={
  <ProtectedRoute>
    <Analytics />
    </ProtectedRoute>
  }/>

  <Route path='/delete-quiz' element={
    <ProtectedRoute>
      <DeleteQuiz/>
      </ProtectedRoute>
    }/>

    <Route path="/qanda-analysis/:quizId" element={
      <ProtectedRoute>
        <QandAQuestionAnalysis />
  </ProtectedRoute>
} />

<Route path="/poll-analysis/:quizId" element={
  <ProtectedRoute>
  <PollQuestionAnalysis />
  </ProtectedRoute>
} />
      
      <Route path='/poll-quiz-interface/:quizLink' element={<PollQuizInterface />}/>
      <Route path='/thanks-poll' element={<ThanksMessagePoll />}/>
     
      <Route path='/qanda-quiz-interface/:quizLink' element={<QandAQuizInterface />} />
      <Route path='/score-qanda' element={<ScoreQandA/>}/>
      
      
      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
   </Router>
   </>
  )
}

export default App
