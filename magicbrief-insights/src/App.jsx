import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import {
  Dashboard,
  Overview,
  Compare,
  Copilot,
  TopHooks,
  TopCreatives,
  CheckLandingPage,
  VideoBreakdown,
  Settings,
} from './pages';
import IterateOnHook from './pages/IterateOnHook';
import IterateOnCTA from './pages/IterateOnCTA';
import StaticBreakdown from './pages/StaticBreakdown';
import TopCopy from './pages/TopCopy';
import TopLandingPage from './pages/TopLandingPage';
import CompareFormats from './pages/CompareFormats';
import ConnectAccounts from './pages/ConnectAccounts';
import './styles/global.css';
import './App.css';

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/overview"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Overview />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Compare />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/copilot"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Copilot />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Settings />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/connect-accounts"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <ConnectAccounts />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Reports - All Functional */}
            <Route
              path="/reports/check-landing-page"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CheckLandingPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/top-hooks"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <TopHooks />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/top-creatives"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <TopCreatives />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/video-breakdown"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <VideoBreakdown />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/iterate-on-hook"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <IterateOnHook />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/iterate-on-cta"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <IterateOnCTA />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/static-breakdown"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <StaticBreakdown />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/top-copy"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <TopCopy />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/top-landing-page"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <TopLandingPage />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/compare-formats"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <CompareFormats />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
