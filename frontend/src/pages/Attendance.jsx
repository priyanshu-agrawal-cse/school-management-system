import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/attendance/select-class').then(r => setClasses(r.data.classes || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>✅ Mark Attendance</h1><p>Select a class to mark today's attendance</p></div>
      </div>

      {loading ? <div className="page-loading">Loading classes...</div> : (
        <div className="class-grid">
          {classes.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No classes found. <a href="/classes/add" className="link">Add classes first.</a>
            </div>
          )}
          {classes.map(c => (
            <div key={c._id} className="glass-card class-card" onClick={() => navigate(`/attendance/mark/${c._id}`)}>
              <div className="class-icon">🏫</div>
              <h3>Class {c.class}</h3>
              <p>Section {c.section}</p>
              <span className="btn btn-primary" style={{ marginTop: '1rem' }}>Mark Attendance →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
