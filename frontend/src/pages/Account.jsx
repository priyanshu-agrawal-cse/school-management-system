import { useEffect, useState } from 'react';
import api from '../api';

export default function Account() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upi, setUpi] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/school/account').then(r => {
      setData(r.data.school);
      setUpi(r.data.school?.upiId || '');
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveUpi = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/school/save-upi-details', { transactionId: upi });
      alert('✅ UPI ID updated successfully');
    } catch {
      alert('Failed to update UPI ID');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Loading account...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>⚙️ Account Settings</h1><p>Manage your school account details</p></div>
      </div>

      <div className="two-col">
        <div className="glass-card">
          <h3>School Information</h3>
          <div className="detail-list">
            <div className="detail-item"><span>School Name</span><strong>{data?.name || '—'}</strong></div>
            <div className="detail-item"><span>Phone</span><strong>{data?.phoneNumber || '—'}</strong></div>
            <div className="detail-item"><span>Hostel Fee</span><strong>₹{data?.hostelFee || '—'}/month</strong></div>
            <div className="detail-item"><span>Current UPI ID</span><strong>{data?.upiId || 'Not set'}</strong></div>
          </div>
        </div>

        <div className="glass-card">
          <h3>Update UPI ID</h3>
          <form onSubmit={handleSaveUpi}>
            <div className="form-group">
              <label>New UPI ID</label>
              <input className="form-input" placeholder="yourname@upi" value={upi}
                onChange={e => setUpi(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update UPI ID'}
            </button>
          </form>
        </div>
      </div>

      {data?.classId?.length > 0 && (
        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
          <h3>📚 Classes</h3>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Class</th><th>Section</th><th>Annual Fee</th></tr></thead>
              <tbody>
                {data.classId.map(c => (
                  <tr key={c._id}>
                    <td>Class {c.class}</td>
                    <td>{c.section}</td>
                    <td>₹{c.acadmicFee?.toLocaleString()}</td>
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
