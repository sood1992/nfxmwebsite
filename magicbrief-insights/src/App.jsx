import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
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
  ReportPlaceholder,
} from './pages';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/settings" element={<Settings />} />

              {/* Reports */}
              <Route path="/reports/check-landing-page" element={<CheckLandingPage />} />
              <Route path="/reports/top-hooks" element={<TopHooks />} />
              <Route path="/reports/top-creatives" element={<TopCreatives />} />
              <Route path="/reports/video-breakdown" element={<VideoBreakdown />} />

              {/* Placeholder Reports (Coming Soon) */}
              <Route path="/reports/iterate-on-hook" element={<ReportPlaceholder />} />
              <Route path="/reports/iterate-on-cta" element={<ReportPlaceholder />} />
              <Route path="/reports/static-breakdown" element={<ReportPlaceholder />} />
              <Route path="/reports/top-copy" element={<ReportPlaceholder />} />
              <Route path="/reports/top-landing-page" element={<ReportPlaceholder />} />
              <Route path="/reports/compare-formats" element={<ReportPlaceholder />} />

              {/* Fallback */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
