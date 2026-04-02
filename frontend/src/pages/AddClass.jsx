import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AddClass() {
  const [rows, setRows] = useState([{ class: '', section: '', acadmicFee: '' }]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const updateRow = (i, f, v) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const addRow = () => setRows(prev => [...prev, { class: '', section: '', acadmicFee: '' }]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Backend expects: { classId: { class: [...], section: [...], acadmicFee: [...] } }
      // Or { classId: { class: '...', section: '...', acadmicFee: '...' } } for single
      
      const payload = {
        classId: {
          class: rows.map(r => r.class),
          section: rows.map(r => r.section),
          acadmicFee: rows.map(r => r.acadmicFee)
        }
      };

      // If only one row, backend might handle as string or array depending on controller logic.
      // The current controller logic handles both.
      
      await api.post('/school/classes/add', payload);
      navigate('/fees');
    } catch (err) {
      alert('Failed to add classes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>🏫 Add New Classes</h1>
          <p>Define additional classes for your school</p>
        </div>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1 }}>
                {i === 0 && <label>Class Name</label>}
                <input className="form-input" placeholder="e.g. 10" value={r.class}
                  onChange={e => updateRow(i, 'class', e.target.value)} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                {i === 0 && <label>Section</label>}
                <input className="form-input" placeholder="e.g. B" value={r.section}
                  onChange={e => updateRow(i, 'section', e.target.value)} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                {i === 0 && <label>Academic Fee (₹)</label>}
                <input className="form-input" type="number" placeholder="Fee amount" value={r.acadmicFee}
                  onChange={e => updateRow(i, 'acadmicFee', e.target.value)} required />
              </div>
              {i > 0 && <button type="button" className="btn btn-danger" onClick={() => removeRow(i)}>✕</button>}
            </div>
          ))}

          <div style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={addRow}>+ Add More Row</button>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Classes'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
