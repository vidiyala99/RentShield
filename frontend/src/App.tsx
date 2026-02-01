import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuestionFlow from './pages/QuestionFlow';
import Result from './pages/Result';
import './index.css';

import Footer from './components/Footer';

import Resources from './pages/Resources';

function App() {
  return (
    <Router>
      <div className="app-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scenario/:id" element={<QuestionFlow />} />
          <Route path="/result" element={<Result />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
