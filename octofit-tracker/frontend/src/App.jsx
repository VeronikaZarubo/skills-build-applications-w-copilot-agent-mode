import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const navItems = [
  { to: '/', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

function AppLayout() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const apiBaseUrl = codespaceName && codespaceName.trim()
    ? 'https://' + codespaceName.trim() + '-8000.app.github.dev'
    : 'http://localhost:8000';

  return (
    <div className="container py-4">
      <header className="mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <p className="text-uppercase text-primary fw-bold mb-1">OctoFit Tracker</p>
            <h1 className="h2 mb-0">Fitness dashboard</h1>
          </div>
          <div className="alert alert-light border mb-0 py-2 px-3">
            <strong>API:</strong>{' '}
            {apiBaseUrl}
          </div>
        </div>

        <nav className="navbar navbar-expand-lg navbar-light bg-light mt-3 rounded shadow-sm px-3">
          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
