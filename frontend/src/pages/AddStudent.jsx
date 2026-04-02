import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function StudentRow({ idx, student, onChange, onRemove }) {
  return (
    <div className="student-row-form">
      <div className="row-num">#{idx + 1}</div>
      <div className="form-grid-4">
        <div className="form-group">
          <label>Name</label>
          <input className="form-input" placeholder="Full name" value={student.name}
            onChange={e => onChange(idx, 'name', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Father's Name</label>
          <input className="form-input" placeholder="Father's name" value={student.father_name}
            onChange={e => onChange(idx, 'father_name', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input className="form-input" placeholder="Phone number" value={student.phoneNumber}
            onChange={e => onChange(idx, 'phoneNumber', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Roll No</label>
          <input className="form-input" type="number" placeholder="Roll number" value={student.rollNumber}
            onChange={e => onChange(idx, 'rollNumber', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Class</label>
          <select className="form-input" value={student.classId} onChange={e => onChange(idx, 'classId', e.target.value)} required>
            <option value="">Select class</option>
            {student._classes?.map(c => (
              <option key={c._id} value={c._id}>{c.class} - {c.section}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hostel</label>
          <select className="form-input" value={student.hostel} onChange={e => onChange(idx, 'hostel', e.target.value)}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
      </div>
      {idx > 0 && (
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onRemove(idx)}>Remove</button>
      )}
    </div>
  );
}

export default function AddStudent() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([{ name: '', father_name: '', phoneNumber: '', rollNumber: '', classId: '', hostel: 'No' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/student/addStudent').then(r => setClasses(r.data.school?.classId || []));
  }, []);

  const updateStudent = (idx, field, value) => {
    setStudents(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addRow = () => setStudents(prev => [...prev, { name: '', father_name: '', phoneNumber: '', rollNumber: '', classId: '', hostel: 'No' }]);
  const removeRow = (idx) => setStudents(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = students.length === 1 ? students[0] : {
        name: students.map(s => s.name),
        father_name: students.map(s => s.father_name),
        phoneNumber: students.map(s => s.phoneNumber),
        rollNumber: students.map(s => s.rollNumber),
        classId: students.map(s => s.classId),
        hostel: students.map(s => s.hostel),
      };
      await api.post('/student/addStudent', payload);
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>➕ Add Students</h1><p>Enroll new students to the system</p></div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {students.map((s, i) => (
          <div className="glass-card" style={{ marginBottom: '1rem' }} key={i}>
            <StudentRow idx={i} student={{ ...s, _classes: classes }} onChange={updateStudent} onRemove={removeRow} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-ghost" onClick={addRow}>+ Add Another Student</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : `Save ${students.length > 1 ? students.length + ' Students' : 'Student'}`}
          </button>
        </div>
      </form>
    </div>
  );
}
