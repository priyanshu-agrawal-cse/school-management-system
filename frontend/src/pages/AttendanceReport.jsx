import { useEffect, useState } from 'react';
import api from '../api';

export default function AttendanceReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendance/report').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading report...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>📋 Attendance Report</h1><p>Daily attendance records by class</p></div>
      </div>

      <div className="glass-card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Date</th><th>Class</th><th>Section</th><th>Present</th><th>Absent</th><th>Leave</th><th>Total</th></tr>
            </thead>
            <tbody>
              {data?.report?.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No attendance records yet</td></tr>
              )}
              {data?.report?.map((r, i) => (
                <tr key={i}>
                  <td>{r._id.date}</td>
                  <td>{r.classDetails?.class}</td>
                  <td>{r.classDetails?.section}</td>
                  <td><span className="badge badge-green">{r.present}</span></td>
                  <td><span className="badge badge-red">{r.absent}</span></td>
                  <td><span className="badge badge-orange">{r.leave}</span></td>
                  <td><strong>{r.present + r.absent + r.leave}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
