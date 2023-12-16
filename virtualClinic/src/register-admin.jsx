import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function RegistrationForm() {
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

      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.type.toLowerCase();

      if (userType !== 'admin') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);

  const formStyle = {
    background: '#f0f0f0',
    padding: '20px',
  };

  const inputStyle = {
    fontSize: '1.2rem',
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Add email state
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const adminData = {
        username,
        email, // Include email in the data being sent
        password,
      };

      const result = await axios.post('http://localhost:3001/add-admin', adminData);
      if (result.data.message === 'Admin added successfully') {
        setMessage('Admin registered successfully.');
      } else if (result.data.message === 'Email Associated With an Existing Account') {
        setMessage('Email Associated With an Existing Account');
      }
      else if (result.data.message === 'Usernmae Associated With an Existing Account') {
        setMessage('Username Associated With an Existing Account');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Navbar />

      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <h2 style={{ color: '#333' }}>Register an Admin</h2>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            boxSizing: 'border-box',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            background: '#fff',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                style={{
                  width: '100%',
                  padding: '10px',
                  boxSizing: 'border-box',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  boxSizing: 'border-box',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  boxSizing: 'border-box',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!username || !email || !password}
              style={{
                backgroundColor: !username || !email || !password ? 'gray' : 'navy',
                color: '#fff',
                padding: '10px 15px',
                borderRadius: '4px',
                cursor: !username || !email || !password ? 'not-allowed' : 'pointer',
                border: 'none',
                width: '100%',
              }}
            >
              Register Admin
            </button>

            <div style={{ marginTop: '15px', textAlign: 'center', color: 'red' }}>{message}</div>
          </form>
        </div>
      </div>

    </div>

  );
}

export default RegistrationForm;
