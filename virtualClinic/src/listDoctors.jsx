import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: 'auto',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  fontSize: '24px',
  color: '#333',
  textAlign: 'center',
  marginBottom: '20px',
};

const searchContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
  padding: '0 200px'
};

const searchFieldsStyle = {
  display: 'flex',
  marginBottom: '10px',
  marginLeft: '30px'
};

const searchFieldStyle = {
  marginRight: '20px',
};

const inputStyle = {
  marginLeft: '20px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '200px', // Adjusted width for better alignment
};

const searchButtonContainerStyle = {
  textAlign: 'right',
};



const subHeaderStyle = {
  fontSize: '20px',
  color: '#333',
  marginTop: '20px',
};

const listItemStyle = {
  margin: '15px 0',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  background: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
};

const doctorDetailsStyle = {
  marginTop: '10px',
};
const listStyle = {
  listStyleType: 'none', // Removes default list bullet points
  padding: '0 200px',          // Removes default padding for the list
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
  const [isHovered, setIsHovered] = useState(false);
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
    setSelectedDateTime('');
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

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:3001/view-family-members', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setFamilyMembers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // Check if the token exists before making the request
    if (token) {
      // Make an Axios GET request to fetch the doctors with session prices
      axios.get('http://localhost:3001/get-doctors-session-price/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          // Set the doctors in the state
          setDoctors(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
          setLoading(false);
        });
    }
  }, []);


  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const nameMatch = doctor.name.toLowerCase().startsWith(searchName.toLowerCase());
      const specialtyMatch = doctor.specialty.toLowerCase().startsWith(searchSpecialty.toLowerCase());
      let hasAvailableSlots;
      if (selectedDateTime) {
        hasAvailableSlots = doctor.availableSlots.some(
          (slot) => new Date(slot).toISOString() === new Date(selectedDateTime).toISOString()
        );
      }


      return (nameMatch || !searchName) && (specialtyMatch || searchSpecialty === 'All Specialties') && (hasAvailableSlots || selectedDateTime === '');
    });

    setFilteredDoctors(filtered);

    if (selectedDoctor && !filtered.find((d) => d._id === selectedDoctor._id)) {
      setSelectedDoctor(null);
    }
  }, [doctors, searchName, searchSpecialty, selectedDoctor, selectedDateTime]);

  const handleReservationOptionChange = async (option) => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/get-doctors-session-price/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
  const buttonStyle = {
    backgroundColor: isHovered ? '#D22B2B' : 'gray',
    color: '#fff',
    padding: '10px 15px',
    height: '45px',
    width: '90px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Add transition for smooth color change on hover
    marginLeft: '20px',
    // Hover styles
    '&:hover': {
      backgroundColor: 'red',
    },
  };
  const handleFamilyMemberSelect = async (familyMember) => {
    setSelectedFamilyMember(familyMember);

    // Fetch the family member's session price
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/get-family-member-session-price/${familyMember._id}/${selectedDoctor._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      <br></br>
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
          <div style={searchButtonContainerStyle}>

            <button onClick={clearSearch} style={buttonStyle} onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>Clear</button>
          </div>
        </div>

      </div>

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
                {selectedDoctor.availableSlots.filter(slot => new Date(slot) > new Date()).length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '15px' }}>Reservation Options:</p>
                      <label style={{ marginRight: '20px', fontSize: '16px', marginTop: "-8px" }}>
                        <input
                          type="radio"
                          name="reservationOption"
                          value="self"
                          checked={reservationOption === 'self'}
                          onChange={() => handleReservationOptionChange('self')}
                          style={{
                            marginRight: '5px', fontSize: '28px', width: '0.55em',
                            height: '0.55em '
                          }}
                        />
                        Reserve for Myself
                      </label>
                      <label style={{ fontSize: '16px', marginTop: "-8px" }}>
                        <input
                          type="radio"
                          name="reservationOption"
                          value="familyMember"
                          checked={reservationOption === 'familyMember'}
                          onChange={() => setReservationOption('familyMember')}
                          style={{
                            marginRight: '5px', fontSize: '28px', width: '0.55em',
                            height: '0.55em'
                          }}
                        />
                        Reserve for Family Member
                      </label>
                    </div>



                    {reservationOption === 'familyMember' && (
                      <div style={{ marginTop: '10px' }}>
                        <label htmlFor="familyMemberSelect">Select Family Member:</label>
                        <select
                          id="familyMemberSelect"
                          value={selectedFamilyMember ? selectedFamilyMember.name : ''}
                          onChange={(e) => handleFamilyMemberSelect(familyMembers.find(member => member.name === e.target.value))}
                          style={{
                            marginLeft: '20px',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            width: '200px',
                            fontSize: '14px', // Adjust the font size as needed
                          }}
                        >
                          <option value="" style={{ fontSize: '16px' }}>Select Family Member</option>
                          {familyMembers.map((familyMember) => (
                            <option key={familyMember._id} style={{ fontSize: '16px' }} value={familyMember.name}>
                              {familyMember.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {selectedDoctor.availableSlots.filter(slot => new Date(slot) > new Date()).length > 0 && (
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '10px 0' }}>Available Slots:</p>
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                          {selectedDoctor.availableSlots.filter(slot => new Date(slot) > new Date())
                            .map((slot, index) => (
                              <li key={index} style={{ marginBottom: '8px' }}>
                                {formatTimeToAMPM(slot)}
                                <button
                                  onClick={(e) => reserveSlot(doctor._id, slot, e)}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#AFE1AF'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = 'navy'}
                                  style={{
                                    marginLeft: '10px',
                                    padding: '8px 12px',
                                    backgroundColor: 'navy',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s', // Add transition for smooth color change on hover
                                  }}
                                >
                                  Pay & Reserve
                                </button>
                              </li>
                            ))}
                        </ul>
                      </div>

                    )}


                  </div>

                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div >
  );
};

function formatTimeToAMPM(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const date = dateTime.toLocaleDateString();
  const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return `${date} - ${time}`;
}

export default Doctors;
