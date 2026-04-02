import { NavLink, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/students', icon: '👨‍🎓', label: 'Students' },
    { to: '/students/add', icon: '➕', label: 'Add Student' },
    { to: '/teachers', icon: '👨‍🏫', label: 'Teachers' },
    { to: '/attendance', icon: '✅', label: 'Attendance' },
    { icon: '📋', label: 'Att. Report', to: '/attendance/report' },
    { icon: '💰', label: 'Fees', to: '/fees' },
    { icon: '🏫', label: 'Add Class', to: '/classes/add' },
    { icon: '📢', label: 'Notices', to: '/notices' },
    { to: '/exams', icon: '📝', label: 'Exams' },
    { to: '/account', icon: '⚙️', label: 'Account' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">🏫 EduSys</div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </aside>
  );
}
