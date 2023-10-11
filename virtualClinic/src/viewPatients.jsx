import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const dropdownStyle = {
    display: selectedPatient ? 'block' : 'none',  // Show when a patient is selected
    background: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
  };
  // Declare filteredPatients in the outer scope
  const filteredPatients = patients.filter(item => {
    const patientName = item.info.name ? item.info.name.toLowerCase() : '';
    const appointmentDate = item.info.date ? new Date(item.info.date).getTime() : 0;
    const today = new Date().getTime();

    return (
      patientName.startsWith(searchTerm.toLowerCase()) &&
      (!upcomingOnly || appointmentDate >= today)
    );
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3001/get-my-patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient === selectedPatient ? null : patient);
  };


  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>List of Patients</h2>
      <div style={searchBarStyle}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={() => setUpcomingOnly(!upcomingOnly)}
            style={checkboxStyle}
          />
          Upcoming Appointments Only
        </label>
      </div>
      <ul style={listStyle}>
        {filteredPatients.map(item => (
          <li key={item.info.name} style={listItemStyle}>
            <div onClick={() => handlePatientClick(item)} style={patientInfoStyle}>
              <strong style={labelStyle}>Name:</strong> {item.info.name}
              <br />
              <strong style={labelStyle}>Appointment Date:</strong>{' '}
              {item.info.date ? new Date(item.info.date).toLocaleDateString() : 'N/A'}
            </div>
            {selectedPatient === item && (
              <div style={dropdownStyle}>
                <strong style={labelStyle}>Email:</strong> {item.info.email}
                <br />
                <strong style={labelStyle}>Date of Birth:</strong> {item.info.dob}
                <br />
                <strong style={labelStyle}>Gender:</strong> {item.info.gender}
                <br />
                <strong style={labelStyle}>Mobile Number:</strong> {item.info.mobileNumber}
                <br />
                <strong style={labelStyle}>Emergency Contact Name:</strong>{' '}
                {item.info.emergencyContactName}
                <br />
                <strong style={labelStyle}>Emergency Contact Number:</strong>{' '}
                {item.info.emergencyContactNumber}
                <br />
                <strong style={labelStyle}>Health Records:</strong>{' '}
                {item.info.healthRecords.join(', ')}
                <br />
              </div>
            )}
            <hr style={hrStyle} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Define your internal styling objects
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: '20px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const searchBarStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const inputStyle = {
  padding: '5px',
  marginRight: '10px',
  width: '200px',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
};

const checkboxStyle = {
  marginRight: '5px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const listItemStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  fontWeight: 'bold',
};

const hrStyle = {
  border: 0,
  borderBottom: '1px solid #ccc',
  margin: '10px 0',
};

const patientInfoStyle = {
  cursor: 'pointer',
};



export default PatientList;
