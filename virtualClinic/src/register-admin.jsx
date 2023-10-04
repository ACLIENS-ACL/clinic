import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';

function RegistrationForm() {
  const formStyle = {
    background: '#f0f0f0', // Background color
    padding: '20px', // Add padding for spacing
  };

  const inputStyle = {
    fontSize: '1.2rem', // Increase font size for larger inputs
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const adminData = {
          username,
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
  );
}

export default RegistrationForm;
