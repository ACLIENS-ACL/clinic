import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function EditInfo() {
  const [doctorInfo, setDoctorInfo] = useState({
    affiliation: '',
    hourlyRate: 0,
    email: '',
  });

  useEffect(() => {
    // Fetch the specific attributes (affiliation, hourlyRate, and email) from the doctor's information
    axios.get(`http://localhost:3001/get-doctor-info`)
      .then((response) => {
        const { affiliation, hourlyRate, email } = response.data;
        setDoctorInfo({ affiliation, hourlyRate, email });
      })
      .catch((error) => console.error(error));
  }, []);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorInfo({ ...doctorInfo, [name]: value });
  };
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "doctor" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send a PUT request to update the specific attributes (affiliation, hourlyRate, and email)
    axios.put(`http://localhost:3001/update-doctor-info`, doctorInfo)
      .then((response) => {
        alert("Info Updated Successfully")
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={containerStyle}>
      <Navbar/>
      <h1>Edit Doctor Info</h1>
      <form onSubmit={handleSubmit}>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>
            Affiliation:
            <input
              type="text"
              name="affiliation"
              value={doctorInfo.affiliation}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>
            Hourly Rate:
            <input
              type="number"
              name="hourlyRate"
              value={doctorInfo.hourlyRate}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>
        <div style={inputContainerStyle}>
          <label style={labelStyle}>
            Email:
            <input
              type="email"
              name="email"
              value={doctorInfo.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>
        <button type="submit" style={buttonStyle}>
          Update Info
        </button>
      </form>
    </div>
  );
}

// Define inline styles
const containerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
};

const inputContainerStyle = {
  marginBottom: '15px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '16px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
  fontSize: '16px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default EditInfo;
