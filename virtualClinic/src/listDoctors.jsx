import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

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
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [reservationOption, setReservationOption] = useState('self');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [hourlyRate, sethourlyRate] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const navigate = useNavigate();
  const specialtyOptions = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Ophthalmology',
    'Pediatrics',
  ];
  const clearSearch = () => {
    setSearchName('');
    setSearchSpecialty('');
    setSelectedDoctor(null);
  };
  const displayDoctorDetails = (doctor, e) => {
    // Check if the event target is an interactive element (button or input)
    const isInteractiveElement = e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT';

    // Do not change the selectedDoctor if the click is on an interactive element
    if (!isInteractiveElement) {
      if (selectedDoctor && selectedDoctor._id === doctor._id) {
        setSelectedDoctor(null);
      } else {
        sethourlyRate(doctor.hourlyRate.toFixed(2));

        setSelectedDoctor(doctor);
      }
    }
  };
  useEffect(() => {
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "patient" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/view-family-members')
      .then((response) => {
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
    const filtered = doctors.filter((doctor) => {
      const nameMatch = doctor.name.toLowerCase().startsWith(searchName.toLowerCase());
      const specialtyMatch = doctor.specialty.toLowerCase().startsWith(searchSpecialty.toLowerCase());
      return (nameMatch || !searchName) && (specialtyMatch || searchSpecialty === 'All Specialties');
    });

    setFilteredDoctors(filtered);

    if (selectedDoctor && !filtered.find((d) => d._id === selectedDoctor._id)) {
      setSelectedDoctor(null);
    }
  }, [doctors, searchName, searchSpecialty, selectedDoctor, selectedDateTime]);

  const handleReservationOptionChange = async (option) => {
    await axios.get(`http://localhost:3001/get-doctors-session-price/`)
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    setReservationOption(option);
  };

  const handleFamilyMemberSelect = async (familyMember) => {
    setSelectedFamilyMember(familyMember);

    // Fetch the family member's session price
    try {
      const response = await axios.get(`http://localhost:3001/get-family-member-session-price/${familyMember._id}/${selectedDoctor._id}`);
      const familyMemberSessionPrice = response.data;
      sethourlyRate(familyMemberSessionPrice.toFixed(2));
      // Update the selected doctor's session price with the family member's session price
      const updatedDoctors = doctors.map((doctor) => {
        if (selectedDoctor && doctor._id === selectedDoctor._id) {
          return {
            ...doctor,
            hourlyRate: familyMemberSessionPrice,
          };
        }
        return doctor;
      });

      setDoctors(updatedDoctors);
    } catch (error) {
      console.error('Error fetching family member session price:', error);
    }
  };

  const NavigateToPay = (totalPaymentDue, type, doctorId, dateTime, familyMemberId) => {
    const navigationPath = `/payAppointment/${totalPaymentDue}/${type}/${doctorId}/${dateTime}/${familyMemberId}`;
    navigate(navigationPath);
  };

  const reserveSlot = async (doctorId, dateTime, e) => {
    // Prevent the default behavior of the click event

    e.preventDefault();
    e.stopPropagation();

    try {
      if (reservationOption === "self") {
        NavigateToPay(hourlyRate, "self", doctorId, dateTime, "none")

      }
      else if (reservationOption === "familyMember" && selectedFamilyMember) {
        NavigateToPay(hourlyRate, "familyMember", doctorId, dateTime, selectedFamilyMember._id)
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while reserving the appointment');
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div style={containerStyle}>
      <Navbar />
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
          <div style={searchFieldStyle}>
            <label htmlFor="searchDateTime">Date and Time:</label>
            <input
              type="datetime-local"
              id="searchDateTime"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={searchButtonContainerStyle}>
          <button onClick={clearSearch} style={buttonStyle}>Clear</button>
        </div>
      </div>

      <h2 style={subHeaderStyle}>Filtered Doctors</h2>
      <ul style={listStyle}>
        {filteredDoctors.map((doctor) => (
          <li key={doctor._id} style={listItemStyle} onClick={(e) => displayDoctorDetails(doctor, e)}>
            <strong>Name:</strong> {doctor.name} <br />
            <strong>Specialty:</strong> {doctor.specialty} <br />
            <strong>Session Price Per Hour:</strong> ${doctor.hourlyRate.toFixed(2)}
            {selectedDoctor && selectedDoctor._id === doctor._id && (
              <div style={doctorDetailsStyle}>
                <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                <p><strong>Affiliation (Hospital):</strong> {selectedDoctor.affiliation}</p>
                <p><strong>Educational Background:</strong> {selectedDoctor.educationalBackground}</p>

                {selectedDoctor.availableSlots.length > 0 && (
                  <div>
                    <p><strong>Available Slots:</strong></p>
                    <ul>
                      {selectedDoctor.availableSlots.map((slot, index) => (
                        <li key={index}>
                          {formatTimeToAMPM(slot)}
                          <button onClick={(e) => reserveSlot(doctor._id, slot, e)}>Pay & Reserve</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedDoctor.availableSlots.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Reservation Options:</strong></p>
                    <label>
                      <input
                        type="radio"
                        name="reservationOption"
                        value="self"
                        checked={reservationOption === 'self'}
                        onChange={() => handleReservationOptionChange('self')}
                      />
                      Reserve for Myself
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="reservationOption"
                        value="familyMember"
                        checked={reservationOption === 'familyMember'}
                        onChange={() => setReservationOption('familyMember')}
                      />
                      Reserve for Family Member
                    </label>

                    {reservationOption === 'familyMember' && (
                      <div style={{ marginTop: '10px' }}>
                        <label htmlFor="familyMemberSelect">Select Family Member:</label>
                        <select
                          id="familyMemberSelect"
                          value={selectedFamilyMember ? selectedFamilyMember.name : ''}
                          onChange={(e) => handleFamilyMemberSelect(familyMembers.find(member => member.name === e.target.value))}
                        >
                          <option value="">Select Family Member</option>
                          {familyMembers.map((familyMember) => (
                            <option key={familyMember._id} value={familyMember.name}>
                              {familyMember.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                  </div>

                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

function formatTimeToAMPM(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const date = dateTime.toLocaleDateString();
  const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return `${date} - ${time}`;
}

export default Doctors;
