import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpaceBackground from './components/SpaceBackground';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import TimetablePage from './pages/TimetablePage';
import AttendancePage from './pages/AttendancePage';
import AttendancePredictorPage from './pages/AttendancePredictorPage';
import ClassAttendanceDetailsPage from './pages/ClassAttendanceDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudyPlanPage from './pages/StudyPlanPage';
import TimelinePage from './pages/TimelinePage';
import OrganizationPage from './pages/OrganizationPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import ReadyPage from './pages/ReadyPage';
import OrganizationProPage from './pages/OrganizationProPage';

// Icons
import {
  HiHome, HiOutlineHome,
  HiCalendar, HiOutlineCalendar,
  HiCollection, HiOutlineCollection,
  HiClipboardList, HiOutlineClipboardList,
  HiUser, HiOutlineUser,
  HiClock, HiOutlineClock,
  HiOutlineSparkles, HiSparkles
} from 'react-icons/hi';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || location.pathname === '/auth') return null;

  const navItems = [
    { path: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome },
    { path: '/calendar', label: 'Calendar', icon: HiOutlineCalendar, activeIcon: HiCalendar },
    { path: '/study-plan', label: 'AI Plan', icon: HiOutlineSparkles, activeIcon: HiSparkles },
    { path: '/timetable', label: 'Timetable', icon: HiOutlineClock, activeIcon: HiClock },
    { path: '/events', label: 'Events', icon: HiOutlineClipboardList, activeIcon: HiClipboardList },
    { path: '/profile', label: 'Profile', icon: HiOutlineUser, activeIcon: HiUser },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <div
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon />
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><LoadingSpinner /></div>;
  return isAuthenticated ? children : <Navigate to="/welcome" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen"><LoadingSpinner /></div>;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const ThemedApp = () => {
  const { bgTheme } = useTheme();
  return (
    <>
      {bgTheme === 'space' && <SpaceBackground />}
      <div className={`app-container ${bgTheme === 'space' ? 'theme-space' : ''}`}>
        <main className="main-content">
          <Routes>
            <Route path="/welcome" element={<PublicRoute><WelcomePage /></PublicRoute>} />
            <Route path="/ready" element={<PublicRoute><ReadyPage /></PublicRoute>} />
            <Route path="/org-pro" element={<PublicRoute><OrganizationProPage /></PublicRoute>} />
            <Route path="/onboarding" element={<PublicRoute><OnboardingPage /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
            <Route path="/attendance/predictor" element={<ProtectedRoute><AttendancePredictorPage /></ProtectedRoute>} />
            <Route path="/attendance/details" element={<ProtectedRoute><ClassAttendanceDetailsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/study-plan" element={<ProtectedRoute><StudyPlanPage /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
            <Route path="/organization" element={<ProtectedRoute><OrganizationPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><ManageCategoriesPage /></ProtectedRoute>} />
            <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicyPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </main>
        <Navigation />
        <ToastContainer position="top-right" theme="colored" />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
