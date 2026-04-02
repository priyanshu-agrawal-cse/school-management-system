import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);

  const fetchNotices = () => {
    setLoading(true);
    api.get('/notice/viewNotices').then(r => setNotices(r.data.notices || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/notice/addNotice', form);
      setForm({ title: '', content: '' });
      setShowAdd(false);
      fetchNotices();
    } catch {
      alert('Failed to add notice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>📢 Notices</h1><p>School announcements and notices</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Cancel' : '+ Add Notice'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <h3>New Notice</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label>Title</label>
              <input className="form-input" placeholder="Notice title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea className="form-input" rows={4} placeholder="Notice content..."
                value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Posting...' : 'Post Notice'}</button>
          </form>
        </div>
      )}

      {loading ? <div className="page-loading">Loading notices...</div> : (
        <div className="notices-list">
          {notices.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No notices yet. Click "Add Notice" to post one.
            </div>
          )}
          {notices.map(n => (
            <div key={n._id} className="glass-card notice-card">
              <div className="notice-header">
                <h3>{n.title}</h3>
                <span className="notice-date">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <p className="notice-content">{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
