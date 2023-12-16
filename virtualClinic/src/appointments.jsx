import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

function AppointmentForm() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`).then((response) => {
      const responseData = response.data;
      if (responseData.type !== 'doctor' || responseData.in !== true) {
        navigate('/login');
        return null;
      }
    });
  }, []);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
      setErrorMessage('Datetime must be entered.');
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
      // Send the list of appointments to your backend
      await axios.post('http://localhost:3001/doctors/add-appointments', { appointments });

      // Clear the appointments list
      setAppointments([]);
    } catch (error) {
      console.error(error);
      // Handle the error, show an error message, etc.
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#f3f3f3',
    width: '50%'
  };

  const formStyle = {
    width: '300px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '300px',
  };

  const errorStyle = {
    color: 'red',
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <h1>Add Appointments</h1>
      <form style={formStyle}>
        <label>Appointment Slot:</label>
        <input
          type="datetime-local"
          id="searchDateTime"
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          style={inputStyle}

        />
        <button onClick={addAppointment} style={buttonStyle}>
          Add Slot
        </button>
      </form>
      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      <div>
        {appointments.map((appointment, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <span>Date and Time: {appointment.toLocaleString()}</span>
            <button onClick={() => removeAppointment(index)} style={{ marginLeft: '10px' }}>
              X
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleFormSubmit} style={buttonStyle}>
        Add Appointments
      </button>
    </div>
  );
}

export default AppointmentForm;
