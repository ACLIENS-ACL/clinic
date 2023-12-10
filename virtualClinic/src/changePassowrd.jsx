import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const validatePassword = (password) => {
  // Password must contain at least one capital letter, one small letter, one special character, and one number.
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

function ChangePassword() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with your actual key

      if (!token) {
        // If the token doesn't exist, navigate to the login page
        navigate('/login');
        return;
      }
    } catch (error) {

    }
  }, [navigate]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('Password does not meet the required criteria.');
      return;
    }

    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage('User not authenticated');
        return;
      }

      // Make an API call to change the password with the token in the headers
      const response = await axios.post('http://localhost:3001/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage('Password changed successfully');
      } else {
        setMessage('Failed to change password');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message || 'An error occurred while changing the password');
    }
  };

  return (
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center', border: '1px black solid', marginTop: '50px' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Change Password</h2>
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ marginBottom: '5px', display: 'block', color: '#555' }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px', width: '100%' }}>
            <label style={{ marginBottom: '5px', display: 'block', color: '#555' }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <label style={{ marginBottom: '5px', display: 'block', color: '#555' }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={{ padding: '8px', width: '100%', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#555',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#4CAF50')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#555')}
          >
            Change Password
          </button>        </form>
        <p style={{ marginTop: '20px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>
      </div>
    </div>
  );

}

export default ChangePassword;
