import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function EditInfo() {

  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState({
    affiliation: '',
    hourlyRate: 0,
    email: '',
  });
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

      if (userType !== 'doctor') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // Check if the token exists before making the request
    if (token) {
      // Make an Axios GET request to fetch the doctor's information
      axios.get('http://localhost:3001/get-doctor-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Extract the specific attributes (affiliation, hourlyRate, and email) from the doctor's information
          const { affiliation, hourlyRate, email } = response.data;

          // Set the doctor's information in the state
          setDoctorInfo({ affiliation, hourlyRate, email });
        })
        .catch((error) => console.error(error));
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorInfo({ ...doctorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); 
    // Send a PUT request to update the specific attributes (affiliation, hourlyRate, and email)
    axios.put(`http://localhost:3001/update-doctor-info`, doctorInfo, {
      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        alert("Info Updated Successfully")
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <br></br>
      <div style={formStyle}>
        <h3 style={{ textAlign: 'center' }}>Edit Your Info</h3>
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
          <button type="submit" style={{
            backgroundColor: 'gray',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '35%'
          }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'navy')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>
            Update Info
          </button>
        </form>
      </div>
    </div>
  );
}

// Define inline styles
const containerStyle = {
  margin: '0 auto',
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

const formStyle = {
  width: '35%',
  margin: 'auto',
  border: '1px solid navy',
  borderRadius: '4px',
  padding: '2%'
};
export default EditInfo;
