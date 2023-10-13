import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "patient" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
 
  useEffect(() => {
    // Make an Axios GET request to fetch the patient's appointments with doctor names and statuses
    axios.get('http://localhost:3001/patientsAppointments')
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

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
                <strong>Doctor:</strong> {appointment.doctorName}<br />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentsList;
