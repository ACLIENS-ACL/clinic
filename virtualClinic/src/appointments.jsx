import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function AppointmentForm() {
  const navigate = useNavigate();

  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
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
  const addAppointment = (e) => {
    e.preventDefault();


    if (selectedDateTime) {
      setErrorMessage(''); // Clear any existing error message

      const newAppointment = new Date(selectedDateTime);

      // Check if the selected appointment is greater than the current time
      const currentTime = new Date();
      if (newAppointment > currentTime) {
        setAppointments([...appointments, newAppointment]);
        setSelectedDateTime('');
      } else {
        setErrorMessage('Appointment must be scheduled for a future date and time.');
      }
    } else {
      setErrorMessage('Choose a Slot to be added!');
    }
  };

  const removeAppointment = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments.splice(index, 1);
    setAppointments(updatedAppointments);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the token from local storage
      const token = localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with your actual key

      // Send the list of appointments to your backend along with the token
      await axios.post('http://localhost:3001/doctors/add-appointments', { appointments }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the appointments list
      setAppointments([]);
    } catch (error) {
      console.error(error);
      // Handle the error, show an error message, etc.
    }
  };

  const containerStyle = {
    width: '30%',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '70%',
    marginRight:'25px'
  };

  const buttonStyle = {
    backgroundColor: 'grey',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '16px',
  };
  const buttonStyleTwo = {
    backgroundColor: 'gray',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft:'30%'
  };

  const errorStyle = {
    color: 'red',
    marginTop: '10px',
  };

  return (
    <div >
      <Navbar />
      <br></br>
      <div style={containerStyle}>
        <br></br>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Appointments</h2>
        <form style={formStyle}>
          <p style={{ color: 'black', fontSize: '14px', fontStyle: 'italic' }}
          ><strong>Choose slots to be available for the patients to reserve</strong></p>
          <label style={{ marginBottom: '5px' }}>Appointment Slot:</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop:'5px' }}>
            <input
              type="datetime-local"
              id="searchDateTime"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              style={{ ...inputStyle }}
            />
            <button onClick={addAppointment} style={buttonStyle} onMouseEnter={(e) => (e.target.style.backgroundColor = 'navy')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>
              Add Slot
            </button>
          </div>

        </form>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
        <div>
          {appointments.map((appointment, index) => (
            <div key={index} style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ marginTop: '5px' }}>Date and Time: {appointment.toLocaleString()}</span>
              <button onClick={() => removeAppointment(index)} style={{ backgroundColor: 'gray', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc3545')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: appointments.length === 0 ? 'none' : 'block' }}>
          <p style={{ color: 'black', fontSize: '13px', fontStyle: 'italic' }}
          ><strong>By clicking add appointments all the confirmed slots will be added as appoitnment slots</strong></p>
          <button onClick={handleFormSubmit} style={buttonStyleTwo} onMouseEnter={(e) => (e.target.style.backgroundColor = 'navy')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>
            Add Appointments
          </button>
        </div>
      </div>
    </div>
  );

}

export default AppointmentForm;
