import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentFeeDetails from './pages/StudentFeeDetails';
import Fees from './pages/Fees';
import Attendance from './pages/Attendance';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';
import Notices from './pages/Notices';
import Exams from './pages/Exams';
import Account from './pages/Account';
import SchoolRegister from './pages/SchoolRegister';

function PrivateRoute({ children, isAuth }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children, isAuth }) {
  return !isAuth ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute isAuth={isAuth}><Login setAuth={setIsAuth} /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute isAuth={isAuth}><Signup setAuth={setIsAuth} /></PublicRoute>} />

        {/* School Registration (after signup, no sidebar) */}
        <Route path="/school/register" element={<PrivateRoute isAuth={isAuth}><SchoolRegister /></PrivateRoute>} />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<PrivateRoute isAuth={isAuth}><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute isAuth={isAuth}><Layout><Students /></Layout></PrivateRoute>} />
        <Route path="/students/add" element={<PrivateRoute isAuth={isAuth}><Layout><AddStudent /></Layout></PrivateRoute>} />
        <Route path="/studentFeedetails/:id" element={<PrivateRoute isAuth={isAuth}><Layout><StudentFeeDetails /></Layout></PrivateRoute>} />
        <Route path="/fees" element={<PrivateRoute isAuth={isAuth}><Layout><Fees /></Layout></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute isAuth={isAuth}><Layout><Attendance /></Layout></PrivateRoute>} />
        <Route path="/attendance/mark/:classId" element={<PrivateRoute isAuth={isAuth}><Layout><MarkAttendance /></Layout></PrivateRoute>} />
        <Route path="/attendance/report" element={<PrivateRoute isAuth={isAuth}><Layout><AttendanceReport /></Layout></PrivateRoute>} />
        <Route path="/notices" element={<PrivateRoute isAuth={isAuth}><Layout><Notices /></Layout></PrivateRoute>} />
        <Route path="/exams" element={<PrivateRoute isAuth={isAuth}><Layout><Exams /></Layout></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute isAuth={isAuth}><Layout><Account /></Layout></PrivateRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={isAuth ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
