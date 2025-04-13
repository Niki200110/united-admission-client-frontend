import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name } = decoded;

      const res = await axios.post('https://united-admission-backendd.onrender.com/api/auth/google', {
        email,
        name,
      }, { withCredentials: true });

      alert(`Login successful as ${res.data.role}`);
      localStorage.setItem('user', JSON.stringify({ email, name }));

      if (res.data.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/student-dashboard';
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="login"
          className="login-image"
        />
        <h2>Welcome to United Admission 🎓</h2>
        <p>Please login using your Google account</p>
        <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Login Failed')} />
      </div>
    </div>
  );
};

export default LoginPage;
