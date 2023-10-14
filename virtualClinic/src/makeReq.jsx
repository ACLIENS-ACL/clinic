import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DoctorRegistrationForm() {
  const [doctorInfo, setDoctorInfo] = useState({});
  const [notes, setNotes] = useState('');
  const [formModified, setFormModified] = useState(false);
  const navigate = useNavigate();
  const specialties = [
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Ophthalmology',
    'Pediatrics',
  ];
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "doctornotreg") {
          navigate('/login')
          return null;
        }
      })
  }, []);
  useEffect(() => {
    axios.get('http://localhost:3001/get-doctor-info')
      .then((response) => {
        setDoctorInfo(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setDoctorInfo({
      ...doctorInfo,
      [e.target.name]: e.target.value,
    });
    setFormModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a data object to send to the server
    const requestData = {
      ...doctorInfo,
      notes,
      enrolled: 'Pending',
    };

    try {
      // Send a POST request to your server to update the doctor's information
      await axios.put('http://localhost:3001/update-doctor-info', requestData);

      setFormModified(false);

      // Optionally, you can display a success message to the user
      alert('Registration request submitted successfully.');
      window.location.reload();

    } catch (error) {
      console.error('Error:', error);

      // Handle errors, e.g., display an error message to the user
      alert('An error occurred while submitting the registration request.');
    }
  };

  // Define your inline styles as JavaScript objects
  const containerStyle = {
    width: '75vw', // Set the width to 75% of the viewport width
    margin: '0 auto', // Center the container horizontally
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginRight: '10px',
  };

  const inputStyle = {
    width: '100%',
    padding: '5px',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: formModified ? '#007BFF' : 'gray',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: formModified ? 'pointer' : 'not-allowed',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#007BFF' }}>Doctor Registration</h1>
      <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '60vw' }}>
        <label style={{ fontSize: '20px', color: 'red' }}>Status:</label> {doctorInfo.enrolled}
      </div>
      <form onSubmit={handleSubmit}>

        <label style={labelStyle}>Name:</label>
        <input
          type="text"
          name="name"
          value={doctorInfo.name || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Email:</label>
        <input
          type="text"
          name="email"
          value={doctorInfo.email || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Date of Birth:</label>
        <input
          type="text"
          name="dob"
          value={doctorInfo.dob || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Gender:</label>
        <input
          type="text"
          name="gender"
          value={doctorInfo.gender || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={doctorInfo.mobileNumber || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Specialty:</label>
        <select
          name="specialty"
          value={doctorInfo.specialty || ''}
          onChange={handleInputChange}
          style={inputStyle}
        >
        <option value="">Select a specialty</option>
        {specialties.map((specialty, index) => (
          <option key={index} value={specialty}>
            {specialty}
          </option>
        ))}
      </select>
        <br />

        <label style={labelStyle}>Hourly Rate:</label>
        <input
          type="Number"
          min="0"
          name="hourlyRate"
          value={doctorInfo.hourlyRate || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Affiliation:</label>
        <input
          type="text"
          name="affiliation"
          value={doctorInfo.affiliation || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Educational Background:</label>
        <input
          type="text"
          name="educationalBackground"
          value={doctorInfo.educationalBackground || ''}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <br />

        <label style={labelStyle}>Professional Summary:</label>
        <textarea
          name="extraNotes"
          value={doctorInfo.extraNotes || ''}
          onChange={handleInputChange}
          style={inputStyle}
          required // Make it a required field
          rows="4"
          cols="50"
        ></textarea>
        <br />
        <button type="submit" disabled={!formModified} style={buttonStyle}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default DoctorRegistrationForm;
