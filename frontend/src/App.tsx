import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import QuestionFlow from './pages/QuestionFlow';
import Result from './pages/Result';
import Resources from './pages/Resources';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import Footer from './components/Footer';
import { useAuth } from './stores/authStore';
import './index.css';

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
            <Route path="/cases/new" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Legacy/Flow Routes - Protected */}
            <Route path="/scenario/:id" element={<ProtectedRoute><QuestionFlow /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />

            {/* Public/Other Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
