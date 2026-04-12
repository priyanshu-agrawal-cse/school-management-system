import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function StudentFeeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState(false);
  
  // Payment upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    api.get(`/student/studentFeedetails/${id}`)
      .then(r => setData(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async (e, amount) => {
    e.preventDefault();
    if (!file) return alert('Please select a screenshot first');
    
    setUploading(true);
    setUploadMessage('');
    const formData = new FormData();
    formData.append('transactionImage', file);

    try {
      await api.post(`/fee/upload-transaction/${data.student._id}/${data.school._id}/${amount}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadMessage('Screenshot uploaded! Transaction is pending verification.');
      setFile(null);
      // Reload data to show pending transaction
      const res = await api.get(`/student/studentFeedetails/${id}`);
      setData(res.data);
    } catch (err) {
      setUploadMessage('Failed to upload. Make sure the UTR/Transaction ID is clearly visible in the image.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="page-loading">Loading student details...</div>;
  if (!data) return <div className="page-loading">Student not found.</div>;

  const { student, school, transaction = [], homeworks = [], attendances = [] } = data;

  const classFee = student.classId?.acadmicFee || 0;
  const hostelFee = student.hostel === 'Yes' && school?.hostelFee ? Number(school.hostelFee) : 0;
  const totalTargetFee = classFee + hostelFee;
  
  const totalPaid = transaction.filter(t => t.status === 'Approved').reduce((s, t) => s + t.amount, 0);
  const pendingTransactionsAmount = transaction.filter(t => t.status !== 'Approved').reduce((s, t) => s + t.amount, 0);
  
  // Amount student still NEEDS to pay right now (assuming pending transactions might fail, but to be safe we subtract pending to avoid double payment)
  const remainingTarget = Math.max(0, totalTargetFee - totalPaid - pendingTransactionsAmount);

  return (
    <div className="page animate-in" style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>👤 {student.name}</h1>
          <p>Class {student.classId?.class} - {student.classId?.section} | Roll No: {student.rollNumber}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={() => setQrModal(true)}>📱 Portal QR</button>
          <Link to="/students" className="btn btn-ghost">← Back</Link>
        </div>
      </div>

      <div className="two-col">
        <div className="glass-card">
          <h3>Student Details</h3>
          <div className="detail-list" style={{ marginTop: '1rem' }}>
            <div className="detail-item"><span>Father's Name</span><strong>{student.father_name}</strong></div>
            <div className="detail-item"><span>Phone</span><strong>{student.phoneNumber}</strong></div>
            <div className="detail-item"><span>Hostel</span><strong>{student.hostel}</strong></div>
            <div className="detail-item"><span>Class Fee</span><strong>₹{classFee}</strong></div>
            {student.hostel === 'Yes' && <div className="detail-item"><span>Hostel Fee</span><strong>₹{hostelFee}</strong></div>}
            <div className="detail-item"><span>Total Target</span><strong>₹{totalTargetFee}</strong></div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Attendance Record</h3>
            <div className="table-wrap" style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '1rem' }}>
              <table className="data-table">
                <thead><tr><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {attendances.length === 0 && <tr><td colSpan="2" style={{ textAlign:'center' }}>No records found</td></tr>}
                  {attendances.map(att => (
                    <tr key={att._id}>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${att.status === 'Present' ? 'badge-green' : att.status === 'Absent' ? 'badge-red' : 'badge-orange'}`}>
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3>Fee Summary</h3>
            <div className="fee-summary" style={{ marginTop: '1rem' }}>
              <div className="fee-box fee-green">
                <div className="fee-amt">₹{totalPaid.toLocaleString()}</div>
                <div className="fee-lbl">Total Paid</div>
              </div>
              <div className="fee-box fee-orange">
                <div className="fee-amt">₹{remainingTarget.toLocaleString()}</div>
                <div className="fee-lbl">Currently Due</div>
              </div>
            </div>
          </div>

          {remainingTarget > 0 && (
            <div className="glass-card" style={{ border: '1px solid var(--primary-color)' }}>
              <h3>💸 Pay Remaining Due</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Pay your exact due amount securely via UPI. You must upload the screenshot of the successful transaction containing the UTR after paying.
              </p>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>₹{remainingTarget}</div>
                
                {school?.upiId ? (
                  <a 
                    href={`upi://pay?pa=${school.upiId}&pn=${encodeURIComponent(school.name)}&am=${remainingTarget}`} 
                    className="btn btn-primary btn-full animate-in"
                    style={{ padding: '1rem', fontSize: '1.1rem' }}
                  >
                    Pay via UPI App Now
                  </a>
                ) : (
                  <div className="alert alert-warning">School UPI ID is not configured. Contact Administration.</div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Upload Payment Screenshot</h4>
                <form onSubmit={e => handleUpload(e, remainingTarget)}>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="form-input" required />
                  <button type="submit" className="btn btn-outline btn-full" disabled={uploading || !file} style={{ marginTop: '1rem' }}>
                    {uploading ? 'Processing Screenshot...' : 'Submit Screenshot'}
                  </button>
                  {uploadMessage && <p style={{ marginTop: '1rem', color: uploadMessage.includes('Failed') ? '#ef4444' : '#4ade80', fontSize: '0.9rem' }}>{uploadMessage}</p>}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h3>💳 Transaction History</h3>
        <div className="table-wrap" style={{ marginTop: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr><th>UTR / Reference</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {transaction.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No transactions yet</td></tr>
              )}
              {transaction.map(t => (
                <tr key={t._id}>
                  <td><code>{t.UTR || 'Pending OCR'}</code></td>
                  <td>₹{t.amount}</td>
                  <td><span className={`badge ${t.status === 'Approved' ? 'badge-green' : 'badge-orange'}`}>{t.status}</span></td>
                  <td>{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {homeworks.length > 0 && (
        <div className="glass-card" style={{ marginTop: '1.5rem' }}>
          <h3>📚 Recent Homework</h3>
          <div className="homework-list" style={{ marginTop: '1rem' }}>
            {homeworks.slice(0, 5).map(hw => (
              <div key={hw._id} className="hw-item">
                <strong>{hw.subject}</strong>
                <p>{hw.homework}</p>
                <small>By {hw.teacherId?.name} · {new Date(hw.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(false)}>
          <div className="modal-card glass-card animate-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Portal Access QR</h3>
              <button className="btn btn-icon" onClick={() => setQrModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <img src={`${api.defaults.baseURL}/student/${id}/qrcode.png`} alt="QR" style={{ width: '250px', borderRadius: '1rem', border: '5px solid white' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Scan this code to access your portal, pay fees, and submit screenshot directly from mobile.</p>
              <a href={`${api.defaults.baseURL}/student/${id}/qrcode.png`} download={`QRCode_${student.rollNumber}.png`} className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>Download QR</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
