import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';

export default function Students() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [classFilter, setClassFilter] = useState(searchParams.get('classId') || '');
  const [qrModal, setQrModal] = useState(null);

  const fetchStudents = (params = {}) => {
    setLoading(true);
    api.get('/student/viewStudent', { params }).then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const showQr = (s) => {
    const url = `${api.defaults.baseURL}/student/${s._id}/qrcode.png`;
    setQrModal({ name: s.name, url });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (classFilter) params.classId = classFilter;
    setSearchParams(params);
    fetchStudents(params);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>👨‍🎓 Students</h1><p>Manage all enrolled students</p></div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} className="filter-row">
          <input className="form-input" placeholder="Search by name..." value={search}
            onChange={e => setSearch(e.target.value)} />
          {data?.classes && (
            <select className="form-input" value={classFilter} onChange={e => setClassFilter(e.target.value)}>
              <option value="">All Classes</option>
              {data.classes.map(c => (
                <option key={c._id} value={c._id}>{c.class} - {c.section}</option>
              ))}
            </select>
          )}
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-ghost" onClick={() => { setSearch(''); setClassFilter(''); fetchStudents(); }}>Reset</button>
        </form>
      </div>

      {loading ? <div className="page-loading">Loading students...</div> : (
        <div className="glass-card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Hostel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.student?.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No students found</td></tr>
                )}
                {data?.student?.map(s => (
                  <tr key={s._id}>
                    <td><span className="badge">{s.rollNumber}</span></td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.father_name}</td>
                    <td>{s.phoneNumber}</td>
                    <td>{s.classId?.class} {s.classId?.section}</td>
                    <td><span className={`badge ${s.hostel === 'Yes' ? 'badge-green' : 'badge-gray'}`}>{s.hostel}</span></td>
                    <td>
                      <Link to={`/studentFeedetails/${s._id}`} className="btn btn-sm btn-ghost">Fees</Link>
                      {' '}
                      <button className="btn btn-sm btn-ghost" onClick={() => showQr(s)}>QR</button>
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
              <h3>{qrModal.name}'s Portal QR</h3>
              <button className="btn btn-icon" onClick={() => setQrModal(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <img src={qrModal.url} alt="Student QR" style={{ width: '250px', borderRadius: '1rem', border: '5px solid white' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Students can scan this to view their fee status and homework.</p>
              <a href={qrModal.url} download={`${qrModal.name}_qr.png`} className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Download QR Code</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
