import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: '20px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const headerStyle = {
  fontWeight: 'bold',
  fontSize: '24px',
  marginBottom: '20px',
};

const filterContainerStyle = {
  marginBottom: '20px',
};

const selectStyle = {
  padding: '5px',
  marginRight: '10px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle = {
  marginBottom: '20px',
};

const statusLabelStyle = {
  fontWeight: 'bold',
  marginRight: '10px',
};

function AppointmentsList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [followUpDateTime, setFollowUpDateTime] = useState('');
  const [rescheduleDateTime, setRescheduleDateTime] = useState(null);
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
  const handleRescheduleAppointment = async (appointmentId) => {
    try {
      // Check if rescheduleDateTime is in the future
      const rescheduleDate = new Date(rescheduleDateTime);
      const currentDate = new Date();

      if (rescheduleDate <= currentDate) {
        alert('Please select a future date for rescheduling.');
        return;
      }

      // Make an Axios POST request to reschedule the appointment
      const response = await axios.post('http://localhost:3001/reschedule-appointment', {
        appointmentId,
        rescheduleDateTime,
      });

      if (response.status === 200) {
        console.log('Appointment rescheduled successfully');
        window.location.reload();
      } else {
        console.log('Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('An error occurred while rescheduling appointment:', error);
    }
  };
  const handleCancelAppointment = (appointmentId) => {
    // Implement the logic to cancel the appointment, e.g., make an Axios request
    axios.post(`http://localhost:3001/cancel-appointment-doctor/${appointmentId}`)
      .then(response => {
        // Handle successful cancellation (e.g., update state or reload appointments)
        console.log('Appointment canceled successfully');
      })
      .catch(error => {
        // Handle error if cancellation fails
        console.error('Error canceling appointment', error);
      });
  };
  useEffect(() => {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem('token');

    // Check if the token is present
    if (!token) {
      console.error('User not authenticated');
      return;
    }

    // Make an Axios GET request to fetch the patient's appointments with doctor names and statuses
    axios.get('http://localhost:3001/doctorsAppointments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);


  const handleFollowUp = async (appointmentId) => {
    try {
      // Make an Axios POST request to schedule follow-up
      const response = await axios.post('http://localhost:3001/schedule-follow-up', {
        originalAppointmentId: appointmentId,
        followUpDateTime,
      });

      if (response.status === 200) {
        console.log('Follow-up scheduled successfully');
        window.location.reload();
      } else {
        console.log('Failed to schedule follow-up');
      }
    } catch (error) {
      console.error('An error occurred while scheduling follow-up:', error);
    }
  };

  const filterAppointments = () => {
    let filteredAppointments = [...appointments];

    if (statusFilter !== 'all') {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.status === statusFilter);
    }
    if (startDateFilter) {
      filteredAppointments = filteredAppointments.filter(appointment => new Date(appointment.date) >= new Date(startDateFilter));
    }
    if (endDateFilter) {
      const nextDay = new Date(endDateFilter);
      nextDay.setDate(nextDay.getDate() + 1);
      filteredAppointments = filteredAppointments.filter(appointment => new Date(appointment.date) < new Date(nextDay));
    }

    return filteredAppointments;
  };

  const filteredAppointments = filterAppointments();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={containerStyle}>
      <Navbar />
      <h2 style={headerStyle}>Appointments</h2>

      <div style={filterContainerStyle}>
        <label>
          Filter by Status:
          <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="canceled">Canceled</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </label>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul style={listStyle}>
          {filteredAppointments.map((appointment) => (
            <li key={appointment._id} style={listItemStyle}>
              <div>
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}<br />
                <span style={statusLabelStyle}>Status:</span> {appointment.status}<br />
              </div>
              <div>
                <strong>Patient:</strong> {appointment.patientName}<br />
              </div>
              {
                appointment.familyMember && (
                  <div>
                    <strong>For Family Memebr:</strong> {appointment.familyMember.name}<br />
                  </div>
                )
              }
              {appointment.status === 'scheduled' && (
                <div>
                  <button onClick={() => handleCancelAppointment(appointment._id)}>
                    Cancel Appointment
                  </button>
                  <label>
                    Reschedule Date:
                    <input
                      type="datetime-local"
                      value={rescheduleDateTime}
                      onChange={(e) => setRescheduleDateTime(e.target.value)}
                    />
                  </label>
                  <button onClick={() => handleRescheduleAppointment(appointment._id)}>
                    Reschedule Appointment
                  </button>
                </div>
              )}
              {appointment.status === 'completed' && !appointment.prescribed && (
                <Link to={`/prescription/${appointment._id}`}>
                  <button>Write Prescription</button>
                </Link>
              )}
              {appointment.status === 'completed' && appointment.prescribed && (
                <Link to={`/prescription/${appointment._id}`}>
                  <button>Modify Prescription</button>
                </Link>
              )}
              {appointment.status === 'completed' && !appointment.followedUp && (
                <div>
                  <label>
                    Follow-up Date:
                    <input
                      type="datetime-local"
                      value={followUpDateTime}
                      onChange={(e) => setFollowUpDateTime(e.target.value)}
                    />
                  </label>
                  <button onClick={() => handleFollowUp(appointment._id)}>
                    Schedule Follow-up
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentsList;
