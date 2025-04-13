import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [year, setYear] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://united-admission-backendd.onrender.com/api/form/all', {
        params: { year, branch }
      });
      setForms(res.data);
      setLoading(false);
    } catch (err) {
      alert("Failed to load forms");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [year, branch]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`https://united-admission-backendd.onrender.com/api/form/status/${id}`, { status });
      fetchForms();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard 🎉</h2>

      <div className="filters">
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="3rd">3rd</option>
          <option value="4th">4th</option>
        </select>

        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="Civil">Civil</option>
        </select>

        <button className="logout-btn" onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}>Logout</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="form-card-container">
          {forms.map((form) => (
            <div className="form-card" key={form._id}>
              <p><strong>Name:</strong> {form.name}</p>
              <p><strong>Year:</strong> {form.year}</p>
              <p><strong>Branch:</strong> {form.branch}</p>
              <p><strong>Status:</strong> <span className={`status ${form.status.toLowerCase()}`}>{form.status}</span></p>
              <p><strong>Documents:</strong></p>
              <div className="doc-links">
                {form.documents.map((doc, i) => (
                  <a key={i} href={`https://united-admission-backendd.onrender.com/uploads/${doc}`} target="_blank" rel="noopener noreferrer">
                    Doc {i + 1}
                  </a>
                ))}
              </div>
              <div style={{ marginTop: '10px' }}>
                <label><strong>Change Status:</strong></label>
                <select value={form.status} onChange={(e) => handleStatusChange(form._id, e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
