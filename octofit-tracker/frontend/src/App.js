import './App.css';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const navItems = [
    { to: '/users', label: 'Users' },
    { to: '/teams', label: 'Teams' },
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <div className="app-shell container py-4 py-md-5">
      <header className="card border-0 shadow-sm mb-4 app-hero">
        <div className="card-body d-flex align-items-center gap-3 gap-md-4 flex-wrap flex-md-nowrap">
          <div className="hero-logo-wrap flex-shrink-0">
            <img
              src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
              alt="OctoFit logo"
              className="hero-logo img-fluid"
            />
          </div>
          <div>
            <h1 className="display-6 fw-bold mb-2">OctoFit Tracker</h1>
            <p className="lead mb-0 text-secondary">
              Browse users, teams, activities, leaderboard standings, and workouts from the REST API.
            </p>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg navbar-light bg-white border rounded px-3 py-2 mb-4 shadow-sm">
        <span className="navbar-brand fw-semibold mb-0">Navigation</span>
        <div className="navbar-nav gap-2 flex-wrap">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link px-3 rounded-pill ${isActive ? 'active bg-primary text-white' : 'text-dark'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
