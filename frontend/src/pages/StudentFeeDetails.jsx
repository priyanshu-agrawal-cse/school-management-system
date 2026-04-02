import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function StudentFeeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/student/studentFeedetails/${id}`).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Loading student details...</div>;
  if (!data) return <div className="page-loading">Student not found.</div>;

  const { student, transaction = [], homeworks = [] } = data;

  const totalPaid = transaction.filter(t => t.status === 'Approved').reduce((s, t) => s + t.amount, 0);
  const totalPending = transaction.filter(t => t.status !== 'Approved').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>👤 {student.name}</h1>
          <p>Class {student.classId?.class} - {student.classId?.section} | Roll No: {student.rollNumber}</p>
        </div>
        <Link to="/students" className="btn btn-ghost">← Back to Students</Link>
      </div>

      <div className="two-col">
        <div className="glass-card">
          <h3>Student Details</h3>
          <div className="detail-list">
            <div className="detail-item"><span>Father's Name</span><strong>{student.father_name}</strong></div>
            <div className="detail-item"><span>Phone</span><strong>{student.phoneNumber}</strong></div>
            <div className="detail-item"><span>Hostel</span><strong>{student.hostel}</strong></div>
            <div className="detail-item"><span>Class Fee</span><strong>₹{student.classId?.acadmicFee}</strong></div>
          </div>
        </div>

        <div className="glass-card">
          <h3>Fee Summary</h3>
          <div className="fee-summary">
            <div className="fee-box fee-green">
              <div className="fee-amt">₹{totalPaid.toLocaleString()}</div>
              <div className="fee-lbl">Total Paid</div>
            </div>
            <div className="fee-box fee-orange">
              <div className="fee-amt">₹{totalPending.toLocaleString()}</div>
              <div className="fee-lbl">Pending</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h3>💳 Transaction History</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>UTR</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {transaction.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions yet</td></tr>
              )}
              {transaction.map(t => (
                <tr key={t._id}>
                  <td><code>{t.UTR}</code></td>
                  <td>₹{t.amount}</td>
                  <td><span className={`badge ${t.status === 'Approved' ? 'badge-green' : 'badge-orange'}`}>{t.status}</span></td>
                  <td>{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {homeworks.length > 0 && (
        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
          <h3>📚 Recent Homework</h3>
          <div className="homework-list">
            {homeworks.slice(0, 5).map(hw => (
              <div key={hw._id} className="hw-item">
                <strong>{hw.subject}</strong>
                <p>{hw.description}</p>
                <small>By {hw.teacherId?.name} · {new Date(hw.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
