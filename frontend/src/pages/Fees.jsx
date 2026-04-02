import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Fees() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchFees = () => {
    setLoading(true);
    api.get('/fee/fees').then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchFees(); }, []);

  const handleVerify = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVerifying(true);
    const fd = new FormData();
    fd.append('statement', file);
    try {
      await api.post('/fee/verify-statement', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('✅ Bank statement verified! Matching transactions approved.');
      fetchFees();
    } catch {
      alert('❌ Failed to verify bank statement.');
    } finally {
      setVerifying(false);
    }
  };

  const approved = data?.transactions?.filter(t => t.status === 'Approved') || [];
  const pending = data?.transactions?.filter(t => t.status !== 'Approved') || [];

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>💰 Fee Management</h1><p>Track and verify student fee payments</p></div>
        <label className={`btn btn-primary ${verifying ? 'disabled' : ''}`}>
          {verifying ? 'Verifying...' : '📄 Upload Bank Statement'}
          <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleVerify} disabled={verifying} />
        </label>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card stat-green">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{approved.length}</div>
          <div className="stat-label">Approved Transactions</div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{pending.length}</div>
          <div className="stat-label">Pending Transactions</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{approved.reduce((s, t) => s + t.amount, 0).toLocaleString()}</div>
          <div className="stat-label">Total Collected</div>
        </div>
      </div>

      {loading ? <div className="page-loading">Loading fees...</div> : (
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>All Transactions</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Class</th><th>UTR</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data?.transactions?.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions found</td></tr>
                )}
                {data?.transactions?.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.studentId?.name || 'Unknown'}</strong></td>
                    <td>{t.studentId?.classId?.class} {t.studentId?.classId?.section}</td>
                    <td><code>{t.UTR}</code></td>
                    <td>₹{t.amount}</td>
                    <td><span className={`badge ${t.status === 'Approved' ? 'badge-green' : 'badge-orange'}`}>{t.status}</span></td>
                    <td>
                      {t.studentId?._id && (
                        <Link to={`/studentFeedetails/${t.studentId._id}`} className="btn btn-sm">View</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
