import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDashboard.css'; // We'll add styles separately

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    year: '',
    branch: '',
  });
  const [documents, setDocuments] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [existingForm, setExistingForm] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.email) {
      axios.get(`https://united-admission-backendd.onrender.com/api/form/myform/${user.email}`)
        .then(res => {
          if (res.data) {
            setExistingForm(res.data);
            setSubmitted(true);
          }
        })
        .catch(() => {});
    }
  }, [user?.email]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("email", user.email); // ensure email is set
    for (const key in formData) {
      if (key !== 'email') {
        data.append(key, formData[key]);
      }
    }
    for (let file of documents) {
      data.append('documents', file);
    }
  
    try {
      await axios.post('https://united-admission-backendd.onrender.com/api/form/submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Form submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Submission failed');
    }
  };
  

  if (!user) return <h3>Please login</h3>;

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      {submitted && existingForm ? (
        <div className="status-box">
          <p><strong>Name:</strong> {existingForm.name}</p>
          <p><strong>Status:</strong> <span className={`status ${existingForm.status.toLowerCase()}`}>{existingForm.status}</span></p>
          <button className="logout-btn" onClick={() => {
  localStorage.clear();
  window.location.href = "/";
}}>Logout</button>
        </div>
      ) : (
        <form className="form-container" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email || user.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input name="dob" type="date" onChange={handleChange} required />
          <select name="year" onChange={handleChange} required>
  <option value="">Select Year</option>
  <option value="1st">1st</option>
  <option value="2nd">2nd</option>
  <option value="3rd">3rd</option>
  <option value="4th">4th</option>
</select>
<select name="branch" onChange={handleChange} required>
  <option value="">Select Branch</option>
  <option value="CSE">CSE</option>
  <option value="ECE">ECE</option>
  <option value="ME">ME</option>
  <option value="Civil">Civil</option>
</select>
          <label>Upload Documents</label>
          <input type="file" multiple onChange={handleFileChange} />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default StudentDashboard;
