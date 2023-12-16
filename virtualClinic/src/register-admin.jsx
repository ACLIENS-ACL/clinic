import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function RegistrationForm() {
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "admin" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);

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
      } else {
        setMessage('Username Already Exists');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <Navbar />

      <MDBContainer className="vh-100 d-flex justify-content-center align-items-center">
        <MDBRow>
          <MDBCol md="8" lg="6">
            <form style={formStyle} onSubmit={handleSubmit}>
              <MDBInput
                label="Username"
                type="text"
                id="username"
                name="username"
                className="mb-4"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                label="Email" // Add email input field
                type="email"
                id="email"
                name="email"
                className="mb-4"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                label="Password"
                type="password"
                id="password"
                name="password"
                className="mb-4"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn color="primary" type="submit">
                Register
              </MDBBtn>
              <div className="mt-3 text-danger">{message}</div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default RegistrationForm;
