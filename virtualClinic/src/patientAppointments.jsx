import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const containerStyle = {
  fontFamily: 'Arial, sans-serif',

  margin: 'auto',
  border: '1px solid #ccc',
};

const headerStyle = {
  fontSize: '24px',
  color: 'rgba(51, 51, 51, 0.353)3',
  textAlign: 'center',
  marginBottom: '20px',
  paddingTop:'30px'
};

const filterContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
  paddingLeft: '200px'
};

const filterLabelStyle = {
  marginRight: '10px',
  fontSize: '16px', // Adjusted font size
  color: '#333',
  marginRight: '30px'
};

const labelStyle = {
  lineHeight: '1.6',
};

const selectStyle = {
  padding: '10px', // Adjusted padding for the select element
  borderRadius: '5px', // Adjusted border radius
  border: '1px solid #ccc',
  marginLeft: '15px'
};

const dateInputStyle = {
  padding: '10px', // Adjusted padding for the date input
  borderRadius: '5px', // Adjusted border radius
  border: '1px solid #ccc',
  marginLeft: '15px'
};

const listStyle = {
  listStyleType: 'none',
  padding: '0 200px',
};

const listItemStyle = {
  margin: '15px 0',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  background: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const statusLabelStyle = {
  fontWeight: 'bold',
  color: '#555',
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: '#fff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  marginRight: '10px',
};

// Additional styles for the Reschedule Modal
const modalContainerStyle = {
  marginTop: '15px',
};

const modalSelectStyle = {
  padding: '8px',
  borderRadius: '3px',
  border: '1px solid #ccc',
  marginRight: '10px',
};

const modalButtonStyle = {
  backgroundColor: '#141b3e',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight:'15px'
};

// Apply these styles as needed in your component


function AppointmentsList() {
  const navigate = useNavigate();
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

      if (userType !== 'patient') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);

  const handleCancelAppointment = (appointmentId) => {

    axios.post(`http://localhost:3001/cancel-appointment/${appointmentId}`)
      .then(response => {
        // Handle successful cancellation (e.g., update state or reload appointments)
        console.log('Appointment canceled successfully');
        window.location.reload();
      })
      .catch(error => {
        // Handle error if cancellation fails
        console.error('Error canceling appointment', error);
      });
  };
  const fetchAvailableSlots = async (appointmentId) => {
    try {
      // Make an Axios GET request to fetch available slots for the specific appointment
      const response = await axios.get(`http://localhost:3001/available-slots/${appointmentId}`);
      setAppointmentAvailableSlots(prevSlots => ({
        ...prevSlots,
        [appointmentId]: response.data,
      }));
    } catch (err) {
      console.error('Error fetching available slots for appointment:', err);
    }
  };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState('');
  const [appointmentAvailableSlots, setAppointmentAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleRescheduleAppointment = async () => {
    try {
      // Make an Axios POST request to reschedule the appointment with the selected slot
      const response = await axios.post('http://localhost:3001/reschedule-appointment-patient', {
        appointmentId: rescheduleAppointmentId,
        rescheduleDateTime: selectedSlot,
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
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Make an Axios GET request to fetch the patient's appointments with doctor names and statuses
    axios.get('http://localhost:3001/patientsAppointments', {
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
  const handleFollowUp = (appointmentId) => {
    const token = localStorage.getItem('token');

    // Make an Axios POST request to indicate a follow-up for the specified appointment
    axios.post(`http://localhost:3001/follow-up/${appointmentId}/${selectedSlot}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        // Handle successful follow-up (e.g., update state or perform additional actions)
        console.log('Follow-up request sent successfully');
        window.location.reload(); // You might want to handle the UI update more gracefully
      })
      .catch(error => {
        // Handle error if the follow-up request fails
        console.error('Error sending follow-up request', error);
      });
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
      <h2 style={headerStyle}>Your Appointments</h2>

      <div style={filterContainerStyle}>
        <label style={filterLabelStyle}>
          Filter by Status:
          <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="canceled">Canceled</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label style={filterLabelStyle}>
          Start Date:
          <input
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            style={dateInputStyle}
          />
        </label>

        <label style={filterLabelStyle}>
          End Date:
          <input
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            style={dateInputStyle}
          />
        </label>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul style={listStyle}>
          {filteredAppointments.map((appointment) => (
            <li key={appointment._id} style={listItemStyle}>
              <div >
                <label style={labelStyle}><strong>Date:</strong></label> {new Date(appointment.date).toLocaleDateString()}<br />
                <label style={labelStyle}><strong>Status:</strong></label> {appointment.status}<br />
                <label style={labelStyle}><strong>Doctor:</strong></label> {appointment.doctorName}<br />
              </div>
              {appointment.familyMember && (
                <div>
                  <strong>For Family Member:</strong> {appointment.familyMember.name}<br />
                </div>
              )}
              {appointment.status === 'completed' && (
                <div>
                  <button
                    style={modalButtonStyle}
                    onClick={() => {
                      setRescheduleAppointmentId(appointment._id);
                      fetchAvailableSlots(appointment._id);
                    }}
                  >
                    Request Follow-up Appointment
                  </button>

                  {/* Reschedule Modal */}
                  {rescheduleAppointmentId && rescheduleAppointmentId === appointment._id && (
                    <div style={modalContainerStyle}>
                      <p>Select a slot for follow-up:</p>
                      <select
                        value={selectedSlot}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        style={modalSelectStyle}
                      >
                        <option value="" disabled>Select a slot</option>
                        {appointmentAvailableSlots[rescheduleAppointmentId]?.map((slot) => (
                          <option key={slot} value={slot}>
                            {new Date(slot).toLocaleString()}
                          </option>
                        ))}
                      </select>
                      <button
                        style={modalButtonStyle}
                        onClick={() => handleFollowUp(appointment._id)}
                      >
                        Reschedule
                      </button>
                    </div>
                  )}
                </div>
              )}
              {appointment.status === 'scheduled' && (
                <div>
                  <button style={modalButtonStyle} onClick={() => handleCancelAppointment(appointment._id)}>Cancel Appointment</button>
                  <button style={modalButtonStyle} onClick={() => {
                    setRescheduleAppointmentId(appointment._id);
                    fetchAvailableSlots(appointment._id);
                  }}>
                    Reschedule Appointment
                  </button>

                  {/* Reschedule Modal */}
                  {rescheduleAppointmentId && rescheduleAppointmentId == appointment._id && (
                    <div>
                      <p>Select a slot for rescheduling:</p>
                      <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                        <option value="" disabled>Select a slot</option>
                        {appointmentAvailableSlots[rescheduleAppointmentId]?.map((slot) => (
                          <option key={slot} value={slot}>{new Date(slot).toLocaleString()}</option>
                        ))}
                      </select>
                      <button style={modalButtonStyle} onClick={() => handleRescheduleAppointment()}>Reschedule</button>
                    </div>
                  )}

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
