import React, { useState, useEffect } from 'react';
import axios from 'axios';

const containerStyle = {
  textAlign: 'center',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ccc',
  maxWidth: '800px',
  fontFamily: 'Arial, sans-serif',
  background: '#f7f7f7',
  borderRadius: '5px',
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#333',
};

const searchContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
};

const searchFieldsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const searchFieldStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  marginRight: '10px',
};

const searchButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const inputStyle = {
  padding: '5px',
  width: '100%',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '5px 10px',
  backgroundColor: '#0074D9',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

const selectedDoctorContainerStyle = {
  marginTop: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
  borderRadius: '5px',
};

const subHeaderStyle = {
  fontSize: '20px',
  marginBottom: '10px',
  color: '#333',
};

const listStyle = {
  listStyle: 'none',
  padding: '0',
};

const listItemStyle = {
  padding: '10px 0',
  borderBottom: '1px solid #ccc',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const doctorDetailsStyle = {
  backgroundColor: 'white',
  padding: '20px',
  border: '1px solid #ccc',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  marginTop: '10px',
  borderRadius: '5px',
};

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/get-doctors-session-price/`)
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter doctors based on search criteria
    const filtered = doctors.filter((doctor) => {
      const nameMatch = doctor.name.toLowerCase().includes(searchName.toLowerCase());
      const specialtyMatch = doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase());
      return (nameMatch || !searchName) && (specialtyMatch || searchSpecialty === 'All Specialties');
    });

    setFilteredDoctors(filtered);

    // Check if the selectedDoctor is still in the filtered list; otherwise, clear the selection
    if (selectedDoctor && !filtered.find((d) => d._id === selectedDoctor._id)) {
      setSelectedDoctor(null);
    }
  }, [doctors, searchName, searchSpecialty, selectedDoctor]);

  const clearSearch = () => {
    setSearchName('');
    setSearchSpecialty('');
    setSelectedDoctor(null);
  };

  const specialtyOptions = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Ophthalmology',
    'Pediatrics',
  ];

  const displayDoctorDetails = (doctor) => {
    if (selectedDoctor && selectedDoctor._id === doctor._id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(doctor);
    }
  };

  const doctorDetails = selectedDoctor ? (
    <div style={doctorDetailsStyle}>
      <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
      <p><strong>Affiliation (Hospital):</strong> {selectedDoctor.affiliation}</p>
      <p><strong>Educational Background:</strong> {selectedDoctor.educationalBackground}</p>
    </div>
  ) : null;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Available Doctors</h1>

      <div style={searchContainerStyle}>
        <div style={searchFieldsStyle}>
          <div style={searchFieldStyle}>
            <label htmlFor="searchName">Name:</label>
            <input
              type="text"
              id="searchName"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={searchFieldStyle}>
            <label htmlFor="searchSpecialty">Specialty:</label>
            <select
              id="searchSpecialty"
              value={searchSpecialty}
              onChange={(e) => setSearchSpecialty(e.target.value)}
              style={inputStyle}
            >
              {specialtyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={searchButtonContainerStyle}>
          <button onClick={clearSearch} style={buttonStyle}>Clear</button>
        </div>
      </div>

      

      <h2 style={subHeaderStyle}>Filtered Doctors</h2>
      <ul style={listStyle}>
        {filteredDoctors.map((doctor) => (
          <li key={doctor._id} style={listItemStyle} onClick={() => displayDoctorDetails(doctor)}>
            <strong>Name:</strong> {doctor.name} <br />
            <strong>Specialty:</strong> {doctor.specialty} <br />
            <strong>Session Price Per Hour:</strong> ${doctor.hourlyRate.toFixed(2)}
          </li>
        ))}
      </ul>
      {selectedDoctor && (
        <div style={selectedDoctorContainerStyle}>
          <h2 style={subHeaderStyle}>Selected Doctor</h2>
          {doctorDetails}
        </div>
      )}
    </div>
  );
};

export default Doctors;
