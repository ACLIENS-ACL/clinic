import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RemoveDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
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
    // Fetch doctors from the server
    axios.get('http://localhost:3001/get-doctors') // Update the API endpoint to fetch doctors
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching doctors.');
      });
  }, []);

  const handleRemove = (doctorId) => {
    // Send a request to remove the doctor from the database
    axios.post(`http://localhost:3001/remove-doctor/${doctorId}`) // Update the API endpoint to remove doctors
      .then(() => {
        // Update the local state to remove the deleted doctor
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== doctorId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the doctor.');
      });
  };

  const tableStyles = {
    width:'75vw',
    textAlign:'center',
    maxWidth: '75vw',
    margin: 'auto',
    border: '1px solid #ccc', // Add border to the table
    borderRadius: '5px',
  };

  const headerStyles = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: '20px',
  };

  const listItemStyles = {
    border: '1px solid #ccc',
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

  return (
    <div>
      <h2 style={headerStyles}>Doctors</h2>
      {message && <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px' }}>{message}</div>}
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date of Birth</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Gender</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Mobile Number</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Specialty</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id} style={listItemStyles}>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.username}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.dob.split('T')[0]}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.gender}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.mobileNumber}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{doctor.specialty}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                <button style={buttonStyles} onClick={() => handleRemove(doctor._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemoveDoctors;
