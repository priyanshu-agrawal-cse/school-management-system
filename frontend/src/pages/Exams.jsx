import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Exams() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({ name: '', classId: '', date: '', subjects: '' });
  const [saving, setSaving] = useState(false);

  const fetchExams = () => {
    setLoading(true);
    api.get('/exam/exams').then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExams();
    api.get('/exam/exams/add').then(r => setClasses(r.data.classes || []));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/exam/exams', form);
      setForm({ name: '', classId: '', date: '', subjects: '' });
      setShowAdd(false);
      fetchExams();
    } catch {
      alert('Failed to create exam');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>📝 Exams</h1><p>Schedule exams and record marks</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Exam'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Schedule New Exam</h3>
          <form onSubmit={handleAdd}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Exam Name</label>
                <input className="form-input" placeholder="e.g. Unit Test 1" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select className="form-input" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} required>
                  <option value="">Select class</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.class} - {c.section}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input className="form-input" type="date" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Subjects (comma-separated)</label>
                <input className="form-input" placeholder="Math, Science, English" value={form.subjects}
                  onChange={e => setForm({ ...form, subjects: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Exam'}</button>
          </form>
        </div>
      )}

      {loading ? <div className="page-loading">Loading exams...</div> : (
        <div className="glass-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Exam Name</th><th>Class</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {data?.exams?.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No exams scheduled</td></tr>
                )}
                {data?.exams?.map(ex => (
                  <tr key={ex._id}>
                    <td><strong>{ex.name}</strong></td>
                    <td>{ex.classId?.class} - {ex.classId?.section}</td>
                    <td>{new Date(ex.date).toLocaleDateString('en-IN')}</td>
                    <td><Link to={`/exam/${ex._id}/marks`} className="btn btn-sm">View Marks</Link></td>
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
