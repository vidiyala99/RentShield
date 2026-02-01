import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Scenario {
  id: number;
  slug: string;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [health, setHealth] = useState<string>('Checking backend...');
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    // Check Health
    axios.get('http://localhost:8000/health')
      .then(res => setHealth(res.data.message))
      .catch(() => setHealth('Backend unreachable'));

    // Fetch Scenarios
    axios.get('http://localhost:8000/scenarios')
      .then(res => setScenarios(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container fade-in">
      <header className="hero">
        <h1 className="gradient-text">RentShield</h1>
        <p className="subtitle">Your AI-Powered Tenant Rights Defender</p>
      </header>

      <div className="card glass">
        <h2>System Status</h2>
        <p className="status-indicator">
          Backend: <span className={health.includes('running') ? 'status-ok' : 'status-error'}>{health}</span>
        </p>
      </div>

      <div className="grid">
        {scenarios.map(scenario => (
          <div key={scenario.id} className="card hover-card">
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
            <Link to={`/scenario/${scenario.id}`} className="btn btn-primary">Start Scenario</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
