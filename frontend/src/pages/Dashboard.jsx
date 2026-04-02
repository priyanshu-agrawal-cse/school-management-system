import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/school/dashboard')
      .then(r => setData(r.data))
      .catch(err => {
        if (err.response?.status === 404 || err.response?.data === 'School not found' || !err.response?.data) {
           navigate('/school/register');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back, {user.username} 👋</h1>
          <p>Here's your school overview for today</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👨‍🎓</div>
          <div className="stat-value">{data?.totalStudents ?? '–'}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">💳</div>
          <div className="stat-value">{data?.totalTransactions ?? '–'}</div>
          <div className="stat-label">Transactions</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{data?.totalFees?.toLocaleString() ?? '–'}</div>
          <div className="stat-label">Fees This Month</div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{data?.paidCount ?? '–'}</div>
          <div className="stat-label">Paid Transactions</div>
        </div>
      </div>

      {data && (
        <div className="charts-row">
          <div className="glass-card chart-card">
            <h3>📈 Monthly Fee Collection</h3>
            <div className="bar-chart">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => {
                const val = data.monthlyGraph?.[i] || 0;
                const max = Math.max(...(data.monthlyGraph || [1]));
                const pct = max > 0 ? (val / max) * 100 : 0;
                return (
                  <div key={m} className="bar-col">
                    <div className="bar-wrap">
                      <div className="bar-fill" style={{ height: `${pct}%` }} title={`₹${val}`} />
                    </div>
                    <span className="bar-label">{m}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card chart-card chart-small">
            <h3>🍩 Fee Status</h3>
            <div className="donut-wrap">
              <div className="donut-legend">
                <div className="legend-item"><span className="dot dot-green" />Paid: {data.paidCount}</div>
                <div className="legend-item"><span className="dot dot-orange" />Pending: {data.pendingCount}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-grid">
          {[
            { to: '/students', label: '👨‍🎓 View Students' },
            { to: '/attendance', label: '✅ Mark Attendance' },
            { to: '/fees', label: '💰 Manage Fees' },
            { to: '/notices', label: '📢 Post Notice' },
            { to: '/exams', label: '📝 Manage Exams' },
            { to: '/classes/add', label: '🏫 Add Classes' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="quick-btn">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
