import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function MarkAttendance() {
  const { classId } = useParams();
  const [data, setData] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/attendance/mark/${classId}`).then(r => {
      setData(r.data);
      const init = {};
      r.data.students.forEach(s => { init[s._id] = 'Present'; });
      setAttendance(init);
    }).finally(() => setLoading(false));
  }, [classId]);

  const setAll = (status) => {
    const upd = {};
    data.students.forEach(s => { upd[s._id] = status; });
    setAttendance(upd);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.post(`/attendance/mark/${classId}`, { attendance });
      navigate('/attendance/report');
    } catch {
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Loading students...</div>;

  const statusColors = { Present: 'badge-green', Absent: 'badge-red', Leave: 'badge-orange' };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>✅ Mark Attendance</h1><p>Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.5rem' }}>Mark All:</span>
          {['Present', 'Absent', 'Leave'].map(s => (
            <button key={s} className={`btn btn-sm ${s === 'Present' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setAll(s)}>{s}</button>
          ))}
          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>{data?.students?.length} students</span>
        </div>
      </div>

      <div className="glass-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Roll No</th><th>Name</th><th>Status</th></tr></thead>
            <tbody>
              {data?.students?.map(s => (
                <tr key={s._id}>
                  <td><span className="badge">{s.rollNumber}</span></td>
                  <td><strong>{s.name}</strong></td>
                  <td>
                    <div className="att-btns">
                      {['Present', 'Absent', 'Leave'].map(status => (
                        <button
                          key={status}
                          className={`btn btn-sm ${attendance[s._id] === status ? status === 'Present' ? 'btn-primary' : status === 'Absent' ? 'btn-danger' : 'btn-warning' : 'btn-ghost'}`}
                          onClick={() => setAttendance(prev => ({ ...prev, [s._id]: status }))}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : '✅ Submit Attendance'}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/attendance')}>Cancel</button>
      </div>
    </div>
  );
}
