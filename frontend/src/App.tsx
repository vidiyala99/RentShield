import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuestionFlow from './pages/QuestionFlow';
import Result from './pages/Result';
import Resources from './pages/Resources';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { CreateCase } from './pages/CreateCase';
import { CaseDetail } from './pages/CaseDetail';
import { CaseHistory } from './pages/CaseHistory';
import { ChatAssistant } from './pages/ChatAssistant';
import Footer from './components/Footer';
import { useAuth } from './stores/authStore';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cases/history" element={<ProtectedRoute><CaseHistory /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
            <Route path="/cases/new" element={<ProtectedRoute><CreateCase /></ProtectedRoute>} />
            <Route path="/cases/:id" element={<ProtectedRoute><CaseDetail /></ProtectedRoute>} />

            {/* Legacy/Flow Routes - Protected */}
            <Route path="/scenario/:id" element={<ProtectedRoute><QuestionFlow /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />

            {/* Public/Other Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>
        {/* Footer is now inside the specific layouts (DashboardLayout) for main pages, 
            but for consistency we can keep it here or conditionally render it. 
            DashboardLayout has its own nav, but not footer. 
            The global footer is fine to keep, but DashboardLayout might have a sidebar style? 
            Actually my DashboardLayout used a top nav and no footer in the code I wrote (it ended with closing div).
            Let's keep the global footer for now as it contains the important disclaimer.
        */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
