import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SchoolRegister() {
  const [rows, setRows] = useState([{ class: '', section: '', acadmicFee: '' }]);
  const [form, setForm] = useState({ name: '', phoneNumber: '', upiId: '', hostelFee: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const updateRow = (i, f, v) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const addRow = () => setRows(prev => [...prev, { class: '', section: '', acadmicFee: '' }]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const classId = rows.length === 1 ? rows[0] : {
        class: rows.map(r => r.class),
        section: rows.map(r => r.section),
        acadmicFee: rows.map(r => r.acadmicFee),
      };
      await api.post('/school/schoolRegistration', { ...form, classId });
      navigate('/dashboard');
    } catch {
      alert('Failed to register school');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-bg">
      <div style={{ width: '100%', maxWidth: '700px', padding: '1rem' }}>
        <div className="glass-card">
          <h2 style={{ marginBottom: '0.5rem' }}>🏫 Register Your School</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Set up your school profile and initial classes</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>School Name</label>
                <input className="form-input" placeholder="School full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" placeholder="Contact number" value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>UPI ID</label>
                <input className="form-input" placeholder="UPI payment ID" value={form.upiId}
                  onChange={e => setForm({ ...form, upiId: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Hostel Fee (₹)</label>
                <input className="form-input" type="number" placeholder="Monthly hostel fee" value={form.hostelFee}
                  onChange={e => setForm({ ...form, hostelFee: e.target.value })} />
              </div>
            </div>

            <h3 style={{ margin: '1.5rem 0 1rem' }}>Classes</h3>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  {i === 0 && <label>Class</label>}
                  <input className="form-input" placeholder="e.g. 5" value={r.class}
                    onChange={e => updateRow(i, 'class', e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  {i === 0 && <label>Section</label>}
                  <input className="form-input" placeholder="e.g. A" value={r.section}
                    onChange={e => updateRow(i, 'section', e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  {i === 0 && <label>Annual Fee (₹)</label>}
                  <input className="form-input" type="number" placeholder="Fee amount" value={r.acadmicFee}
                    onChange={e => updateRow(i, 'acadmicFee', e.target.value)} required />
                </div>
                {i > 0 && <button type="button" className="btn btn-danger btn-sm" onClick={() => removeRow(i)}>✕</button>}
              </div>
            ))}

            <button type="button" className="btn btn-ghost" onClick={addRow} style={{ marginBottom: '1.5rem' }}>+ Add Class</button>

            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              {saving ? 'Registering...' : 'Register School & Continue →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
