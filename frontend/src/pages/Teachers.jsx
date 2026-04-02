import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Teachers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', subject: '', phoneNumber: '', classId: '' });
  const [saving, setSaving] = useState(false);

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
      await api.post('/teacher/teachers', form);
      setForm({ name: '', subject: '', phoneNumber: '', classId: '' });
      setShowAdd(false);
      fetchTeachers();
    } catch {
      alert('Failed to add teacher');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>👨‍🏫 Teachers</h1><p>Manage teaching staff</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Teacher'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Add New Teacher</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Name</label>
                <input className="form-input" placeholder="Teacher's full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input className="form-input" placeholder="Subject taught" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" placeholder="Contact number" value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Class (optional)</label>
                <select className="form-input" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
                  <option value="">No class assigned</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.class} - {c.section}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Teacher'}</button>
          </form>
        </div>
      )}

      {loading ? <div className="page-loading">Loading teachers...</div> : (
        <div className="glass-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Subject</th><th>Phone</th><th>Class</th></tr></thead>
              <tbody>
                {(!data?.teachers || data.teachers.length === 0) && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No teachers added yet</td></tr>
                )}
                {data?.teachers?.map(t => (
                  <tr key={t._id}>
                    <td><strong>{t.name}</strong></td>
                    <td>{t.subject}</td>
                    <td>{t.phoneNumber || '—'}</td>
                    <td>{t.classId ? `${t.classId.class} - ${t.classId.section}` : '—'}</td>
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
