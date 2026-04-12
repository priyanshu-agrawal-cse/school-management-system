import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function ExamMarks() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/exam/exam/${id}/marks`)
      .then(r => setData(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Loading marks data...</div>;
  if (!data) return <div className="page-loading">Exam details not found</div>;

  const { exam, students, results } = data;

  // Group results by subject
  const subjectsSet = new Set();
  results.forEach(r => subjectsSet.add(r.subject));
  const subjects = Array.from(subjectsSet);

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div>
          <h1>📝 {exam.name} marks</h1>
          <p>Class: {exam.classId?.class} - {exam.classId?.section} | Scheduled: {new Date(exam.date).toLocaleDateString()}</p>
        </div>
        <Link to="/exams" className="btn btn-ghost">← Back to Exams</Link>
      </div>

      <div className="glass-card">
        <h3>Exam Marks Report</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          These marks are uploaded by class teachers from their portal.
        </p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                {subjects.map(s => <th key={s}>{s}</th>)}
                {subjects.length === 0 && <th>Marks</th>}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={subjects.length + 2} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No students in this class.
                  </td>
                </tr>
              )}
              {students.map(student => {
                const studentResults = results.filter(r => r.studentId === student._id);
                return (
                  <tr key={student._id}>
                    <td><span className="badge">{student.rollNumber}</span></td>
                    <td><strong>{student.name}</strong></td>
                    {subjects.length > 0 ? (
                      subjects.map(subj => {
                        const markRec = studentResults.find(r => r.subject === subj);
                        return (
                          <td key={subj}>
                            {markRec ? `${markRec.marksObtained}` : <span style={{ color: 'var(--text-muted)' }}>--</span>}
                          </td>
                        );
                      })
                    ) : (
                      <td style={{ color: 'var(--text-muted)' }}>No marks uploaded yet.</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
