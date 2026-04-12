import { useEffect, useState } from 'react';
import api from '../api';

export default function Teachers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    subjects: '', 
    phoneNumber: '', 
    email: '', 
    address: '', 
    salary: '', 
    classId: '' 
  });
  const [saving, setSaving] = useState(false);
  const [qrModal, setQrModal] = useState(null);

  const fetchTeachers = () => {
    setLoading(true);
    api.get('/teacher/teachers').then(r => setData(r.data)).catch(() => setData({ teachers: [] })).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeachers();
    api.get('/student/addStudent').then(r => setClasses(r.data.school?.classId || [])).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/teacher/teachers/add', form);
      setForm({ name: '', subjects: '', phoneNumber: '', email: '', address: '', salary: '', classId: '' });
      setShowAdd(false);
      fetchTeachers();
    } catch {
      alert('Failed to add teacher');
    } finally {
      setSaving(false);
    }
  };

  const showQr = (t) => {
    const url = `${api.defaults.baseURL}/teacher/${t._id}/qrcode.png`;
    setQrModal({ name: t.name, url });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>👨‍🏫 Teachers</h1><p>Manage teaching staff and access portals</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card animate-in" style={{ marginBottom: '1.5rem' }}>
          <h3>Assign New Staff Member</h3>
          <form onSubmit={handleAdd} className="auth-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" placeholder="e.g. Rahul Sharma" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" placeholder="email@school.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" placeholder="Contact number" value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Salary (₹)</label>
                <input className="form-input" type="number" placeholder="Monthly salary" value={form.salary}
                  onChange={e => setForm({ ...form, salary: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Subjects</label>
                <input className="form-input" placeholder="e.g. Math, Physics" value={form.subjects}
                  onChange={e => setForm({ ...form, subjects: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" placeholder="Residential address" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>In-charge Class (optional)</label>
                <select className="form-input" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
                  <option value="">No class assigned</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.class} - {c.section}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Adding...' : 'Confirm & Add Teacher'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="page-loading">Loading teachers...</div> : (
        <div className="glass-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Staff Name</th><th>Subjects</th><th>Salary</th><th>Class</th><th>Portal</th></tr></thead>
              <tbody>
                {(!data?.teachers || data.teachers.length === 0) && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No teachers added yet</td></tr>
                )}
                {data?.teachers?.map(t => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong>{t.name}</strong>
                        <small style={{ color: 'var(--text-muted)' }}>{t.email}</small>
                      </div>
                    </td>
                    <td><div className="subject-pills">{t.subjects?.map(s => <span key={s} className="badge badge-gray">{s}</span>)}</div></td>
                    <td>₹{t.salary?.toLocaleString()}</td>
                    <td>{t.classId ? `${t.classId.class} - ${t.classId.section}` : '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-ghost" onClick={() => showQr(t)}>📱 Login QR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(null)}>
          <div className="modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{qrModal.name}'s Login QR</h3>
              <button className="btn btn-icon" onClick={() => setQrModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <img src={qrModal.url} alt="Teacher QR" style={{ width: '250px', borderRadius: '1rem', border: '5px solid white' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Scan this code to log into the teacher portal directly.</p>
              <a href={qrModal.url} download={`${qrModal.name}_qr.png`} className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Download QR Code</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
