import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyJobs from "./pages/Jobs/MyJobs";
import Messages from "./pages/Messages";
import PostJobForTeaching from "./pages/Jobs/PostJobForTeaching";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";
import FindStudent from './pages/FindStudent';
import FindTeacher from './pages/FindTeacher';
import StudentDetail from "./pages/Jobs/StudentJobDetail";
import TeacherDetail from './pages/Jobs/TeacherJobDetail'
import TeacherSavedJob from "./pages/TeacherSavedJob";
import StudentSavedJob from "./pages/StudentSavedJob";
import TeacherProfile from "./pages/TeacherProfile";
import StudentProfile from './pages/StudentProfile'
import PostJobForStudying from "./pages/Jobs/PostJobForStudying";

const AppContent = () => {
  const { pathname } = useLocation();

  return (
    <>

      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/teacher-saved-jobs"
          element={
            <ProtectedRoute>
              <TeacherSavedJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-student"
          element={
            <ProtectedRoute>
              <FindStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-teacher"
          element={
            <ProtectedRoute>
              <FindTeacher />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-saved-jobs"
          element={
            <ProtectedRoute>
              <StudentSavedJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job-for-teaching"
          element={
            <ProtectedRoute>
              <PostJobForTeaching />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job-for-studying"
          element={
            <ProtectedRoute>
              <PostJobForStudying />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-job-detail/:id"
          element={
            <StudentDetail />
          }
        />
        <Route
          path="/teacher-job-detail/:id"
          element={
            <TeacherDetail />
          }
        />

        <Route
          path="/teacher-profile"
          element={
            <TeacherProfile />
          }
        />
        <Route
          path="/student-profile"
          element={
            <StudentProfile />
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;