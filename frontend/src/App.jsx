import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import TeacherPortal from './pages/TeacherPortal';
import StudentFeeDetails from './pages/StudentFeeDetails';
import Fees from './pages/Fees';
import Attendance from './pages/Attendance';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';
import Notices from './pages/Notices';
import Exams from './pages/Exams';
import Account from './pages/Account';
import SchoolRegister from './pages/SchoolRegister';
import Teachers from './pages/Teachers';
import AddClass from './pages/AddClass';
import Home from './pages/Home';
import ExamMarks from './pages/ExamMarks';

function PrivateRoute({ children, isAuth, hasSchool, isLoading }) {
  const location = useLocation();
  
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  
  if (isLoading) return <div className="loading-screen">Loading...</div>;
  
  // If authenticated but no school registered (and not on registration page), redirect to register
  if (hasSchool === false && location.pathname !== '/school/register') {
    return <Navigate to="/school/register" replace />;
  }
  
  // If authenticated and school registered, but trying to go to registration page, go to dashboard
  if (hasSchool === true && location.pathname === '/school/register') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function PublicRoute({ children, isAuth, hasSchool }) {
  if (!isAuth) return children;
  
  // If already authenticated, redirect to registration if needed, otherwise dashboard
  return hasSchool === false 
    ? <Navigate to="/school/register" replace /> 
    : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [hasSchool, setHasSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isAuth) {
      setIsLoading(true);
      api.get('/school/registration-status')
        .then(res => {
          setHasSchool(res.data.registered);
          setIsLoading(false);
        })
        .catch(() => {
          setHasSchool(false);
          setIsLoading(false);
        });
    } else {
      setHasSchool(null);
      setIsLoading(false);
    }
  }, [isAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute isAuth={isAuth} hasSchool={hasSchool}><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute isAuth={isAuth} hasSchool={hasSchool}><Login setAuth={setIsAuth} /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute isAuth={isAuth} hasSchool={hasSchool}><Signup setAuth={setIsAuth} /></PublicRoute>} />

        {/* School Registration (after signup, no sidebar) */}
        <Route path="/school/register" element={
          <PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}>
            <SchoolRegister setHasSchool={setHasSchool} />
          </PrivateRoute>
        } />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Students /></Layout></PrivateRoute>} />
        <Route path="/students/add" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><AddStudent /></Layout></PrivateRoute>} />
        <Route path="/studentFeedetails/:id" element={<StudentFeeDetails />} />
        <Route path="/teacher/portal/:id" element={<TeacherPortal />} />
        <Route path="/fees" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Fees /></Layout></PrivateRoute>} />
        <Route path="/classes/add" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><AddClass /></Layout></PrivateRoute>} />
        <Route path="/teachers" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Teachers /></Layout></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Attendance /></Layout></PrivateRoute>} />
        <Route path="/attendance/mark/:id" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><MarkAttendance /></Layout></PrivateRoute>} />
        <Route path="/attendance/report" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><AttendanceReport /></Layout></PrivateRoute>} />
        <Route path="/notices" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Notices /></Layout></PrivateRoute>} />
        <Route path="/exams" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Exams /></Layout></PrivateRoute>} />
        <Route path="/exam/:id/marks" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><ExamMarks /></Layout></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute isAuth={isAuth} hasSchool={hasSchool} isLoading={isLoading}><Layout><Account /></Layout></PrivateRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={isAuth ? (hasSchool ? '/dashboard' : '/school/register') : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
