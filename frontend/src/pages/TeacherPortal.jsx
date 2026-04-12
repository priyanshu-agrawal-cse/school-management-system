import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function TeacherPortal() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homework'); // 'homework' | 'attendance' | 'marks'

  // Homework
  const [homeworkForm, setHomeworkForm] = useState({ subject: '', homework: '', classId: '' });
  const [posting, setPosting] = useState(false);

  // Attendance
  const [attendance, setAttendance] = useState({});
  const [savingAtt, setSavingAtt] = useState(false);

  // Marks
  const [marksForm, setMarksForm] = useState({ examName: '', subject: '' });
  const [marks, setMarks] = useState({});
  const [savingMarks, setSavingMarks] = useState(false);

  const fetchPortalData = () => {
    setLoading(true);
    api.get(`/teacher/portal/${id}`)
      .then(r => {
        setData(r.data);
        const initAtt = {};
        const initMarks = {};
        if (r.data.students) {
          r.data.students.forEach(s => { 
            initAtt[s._id] = 'Present'; 
            initMarks[s._id] = '';
          });
        }
        setAttendance(initAtt);
        setMarks(initMarks);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortalData();
  }, [id]);

  const handlePostHomework = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post(`/teacher/add-homework/${id}`, homeworkForm);
      setHomeworkForm({ subject: '', homework: '', classId: '' });
      fetchPortalData();
      alert('Homework posted!');
    } catch {
      alert('Failed to post homework');
    } finally {
      setPosting(false);
    }
  };

  const handleSaveAttendance = async () => {
    setSavingAtt(true);
    try {
      await api.post(`/teacher/mark-attendance/${data.teacher.classId._id}`, { attendance });
      alert('Attendance saved successfully!');
    } catch {
      alert('Failed to save attendance');
    } finally {
      setSavingAtt(false);
    }
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    setSavingMarks(true);
    try {
      await api.post(`/teacher/upload-marks/${data.teacher.classId._id}`, {
        examName: marksForm.examName,
        subject: marksForm.subject,
        marks
      });
      alert('Marks uploaded successfully!');
      setMarksForm({ examName: '', subject: '' });
      const initMarks = {};
      data.students.forEach(s => initMarks[s._id] = '');
      setMarks(initMarks);
    } catch {
      alert('Failed to upload marks');
    } finally {
      setSavingMarks(false);
    }
  };

  if (loading) return <div className="page-loading">Initializing Teacher Portal...</div>;
  if (!data) return <div className="page-loading">Portal not found.</div>;

  const { teacher, students, homeworks, classes } = data;

  return (
    <div className="page animate-in" style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>👋 Welcome, {teacher.name}</h1>
          <p>Teacher Portal | {teacher.schoolId?.name}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'homework' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('homework')}>📢 Homework</button>
        <button className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('attendance')}>✅ Mark Attendance</button>
        <button className={`btn ${activeTab === 'marks' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('marks')}>📝 Upload Marks</button>
      </div>

      {activeTab === 'homework' && (
        <div className="two-col">
          <div className="glass-card">
            <h3>📢 Post Homework</h3>
            <form onSubmit={handlePostHomework} className="auth-form" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Select Class</label>
                <select className="form-input" value={homeworkForm.classId} onChange={e => setHomeworkForm({ ...homeworkForm, classId: e.target.value })} required>
                  <option value="">-- Choose Class --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.class} - {c.section}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input className="form-input" value={homeworkForm.subject} onChange={e => setHomeworkForm({ ...homeworkForm, subject: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Homework Text</label>
                <textarea className="form-input" rows={4} value={homeworkForm.homework} onChange={e => setHomeworkForm({ ...homeworkForm, homework: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={posting}>
                {posting ? 'Posting...' : 'Post Homework'}
              </button>
            </form>
          </div>

          <div className="glass-card">
            <h3>📚 Assigned Homework History</h3>
            <div className="homework-list" style={{ marginTop: '1rem' }}>
              {homeworks.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No homework posted yet.</p>}
              {homeworks.map(hw => (
                <div key={hw._id} className="hw-item animate-in">
                  <strong>{hw.subject}</strong>
                  <p>{hw.homework}</p>
                  <small>{new Date(hw.createdAt).toLocaleDateString()} - {new Date(hw.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="glass-card animate-in">
          <h3>✅ Mark Daily Attendance ({teacher.classId?.class} - {teacher.classId?.section})</h3>
          <div className="table-wrap" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead><tr><th>Roll</th><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td><span className="badge">{s.rollNumber}</span></td>
                    <td><strong>{s.name}</strong></td>
                    <td>
                      <div className="att-btns">
                        {['Present', 'Absent', 'Leave'].map(st => (
                          <button key={st} type="button"
                            className={`btn btn-sm ${attendance[s._id] === st ? st === 'Present' ? 'btn-primary' : st === 'Absent' ? 'btn-danger' : 'btn-warning' : 'btn-ghost'}`}
                            onClick={() => setAttendance(p => ({ ...p, [s._id]: st }))}>
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary" onClick={handleSaveAttendance} disabled={savingAtt} style={{ marginTop: '1.5rem' }}>
            {savingAtt ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="glass-card animate-in">
          <h3>📝 Upload Exam Marks ({teacher.classId?.class} - {teacher.classId?.section})</h3>
          <form onSubmit={handleSaveMarks} style={{ marginTop: '1rem' }}>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Exam Name (e.g. Unit Test 1)</label>
                <input className="form-input" value={marksForm.examName} onChange={e => setMarksForm({ ...marksForm, examName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input className="form-input" value={marksForm.subject} onChange={e => setMarksForm({ ...marksForm, subject: e.target.value })} required />
              </div>
            </div>
            
            <div className="table-wrap" style={{ marginTop: '1.5rem' }}>
              <table className="data-table">
                <thead><tr><th>Roll</th><th>Name</th><th>Marks Obtained (out of 100)</th></tr></thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id}>
                      <td><span className="badge">{s.rollNumber}</span></td>
                      <td><strong>{s.name}</strong></td>
                      <td>
                        <input className="form-input" type="number" min="0" max="100" style={{ maxWidth: '100px' }}
                          value={marks[s._id] || ''} onChange={e => setMarks(p => ({ ...p, [s._id]: Number(e.target.value) }))} required />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" className="btn btn-primary" disabled={savingMarks} style={{ marginTop: '1.5rem' }}>
              {savingMarks ? 'Uploading...' : 'Upload Marks'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
