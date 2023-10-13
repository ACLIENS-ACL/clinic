import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RemovePatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState('');
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
  useEffect(() => {
    // Fetch patients from the server
    axios.get('http://localhost:3001/get-patients') // Replace with your API endpoint to fetch patients
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching patients.');
      });
  }, []);

  const handleRemove = (patientId) => {
    // Send a request to remove the patient from the database
    axios.post(`http://localhost:3001/remove-patient/${patientId}`) // Replace with your API endpoint to remove patients
      .then(() => {
        // Update the local state to remove the deleted patient
        setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== patientId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the patient.');
      });
  };

  const containerStyles = {
    maxWidth: '75vw', // Set the maximum width to 75vw
    margin: '0 auto',
    padding: '20px',
    background: '#f8f9fa',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const headerStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: '20px',
  };

  const listItemStyles = {
    border: '1px solid #ccc', // Add border
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  };

  const buttonStyles = {
    marginRight: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  const textCenteredStyles = {
    textAlign: 'center',
  };

  return (
    <div style={containerStyles}>
      <h2 style={headerStyles}>Patients</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={textCenteredStyles}>Username</th>
            <th style={textCenteredStyles}>Name</th>
            <th style={textCenteredStyles}>Gender</th>
            <th style={textCenteredStyles}>Phone Number</th>
            <th style={textCenteredStyles}>Email</th>
            <th style={textCenteredStyles}>Date of Birth</th>
            <th style={textCenteredStyles}>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id} style={listItemStyles}>
              <td style={textCenteredStyles}>{patient.username}</td>
              <td style={textCenteredStyles}>{patient.name}</td>
              <td style={textCenteredStyles}>{patient.gender}</td>
              <td style={textCenteredStyles}>{patient.mobileNumber}</td>
              <td style={textCenteredStyles}>{patient.email}</td>
              <td style={textCenteredStyles}>{new Date(patient.dob).toLocaleDateString()}</td>
              <td style={textCenteredStyles}>
                <button style={buttonStyles} onClick={() => handleRemove(patient._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemovePatients;
