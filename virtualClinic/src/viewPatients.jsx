import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function PatientList() {
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

      if (userType !== 'doctor') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  const [newRecordFile, setNewRecordFile] = useState(null);

  const handleAddRecordClick = (e) => {
    // Check if the clicked element is not an interactive element
    if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
      setShowAddRecordForm(true); // Stop the click event from propagating
    }

    setShowAddRecordForm(!showAddRecordForm);
  };

  const handleFileChange = (e) => {
    setNewRecordFile(e.target.files[0]);
  };

  const handleAddRecordSubmit = () => {
    const formData = new FormData();
    formData.append('patientId', selectedPatient.info._id);
    formData.append('familyMember', selectedPatient.info.familyMemberName) // Replace with the actual patient ID
    formData.append('recordFile', newRecordFile);
    const familyMemberValue = formData.get('familyMember');

    // Assuming you have an API endpoint to upload a health record file
    axios.post('http://localhost:3001/upload-health-record', formData)
      .then(response => {
        // Handle success, maybe fetch updated patient data
        fetchData();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setShowAddRecordForm(false);
        setNewRecordFile(null);
      });
  };
  const handleHealthRecordClick = (filePath) => {
    const fileName = filePath.split('\\').pop();
    axios.get(`http://localhost:3001/uploads/${fileName}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop(); // Extract filename from the path
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const dropdownStyle = {
    display: selectedPatient ? 'block' : 'none',  // Show when a patient is selected
    background: '#efebebe9',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid black',
    marginTop: '5px'
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
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/get-my-patients', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePatientClick = (patient, e) => {
    if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
      return;
    }
    setSelectedPatient(patient === selectedPatient ? null : patient);
  };


  return (
    <div>
      <Navbar />
      <br></br>
      <div style={containerStyle}>
        <h2 style={headerStyle}>List of Patients</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <label style={{ marginRight: '10px' }}>Filter: </label>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '5px',
              marginRight: '10px',
              width: '200px',
              borderRadius: '3px',
              border: '1px solid black'
            }}
          />
          <div style={{ marginTop: '5px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="checkbox"
                checked={upcomingOnly}
                onChange={() => setUpcomingOnly(!upcomingOnly)}
                style={{
                  marginRight: '5px',
                }}
              />
              Upcoming Appointments Only
            </label>
          </div>
        </div>
        <ul style={listStyle}>
          {filteredPatients.filter(item => !item.info.account).map(item => (
            <li key={item.info.name} style={listItemStyle}>
              {!item.info.familyMemberName && (
                <div onClick={(e) => handlePatientClick(item, e)} style={patientInfoStyle}>
                  <strong style={labelStyle}>Patient Name:</strong> {item.info.name}
                  <br />
                  <strong style={labelStyle}>Appointment Date:</strong>{' '}

                  {item.info.date ? new Date(item.info.date).toLocaleDateString() : 'N/A'}
                  <br></br>
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
                      {item.info.healthRecords && item.info.healthRecords.map((record, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            onClick={() => handleHealthRecordClick(record)}
                          >
                            View Health Record {index + 1}
                          </a>
                        </li>

                      ))}

                      <strong style={labelStyle}>Medical History:</strong>
                      <ul>
                        {item.info.medicalHistory && item.info.medicalHistory.map((file, index) => (
                          <li key={index}>
                            <a
                              href={`http://localhost:3001/${file.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div>
                        <button
                          onClick={(e) => handleAddRecordClick(e)}
                          onMouseEnter={(e) => showAddRecordForm ? e.target.style.backgroundColor = 'crimson' : e.target.style.backgroundColor = '#0056b3'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'gray'}
                          style={{
                            padding: '8px',
                            margin: '10px 0',
                            cursor: 'pointer',
                            backgroundColor: 'gray',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            transition: 'background-color 0.3s',
                          }}
                        >
                          {showAddRecordForm ? 'Cancel' : 'Add Health Record'}
                        </button>
                        {showAddRecordForm && (
                          <div
                            style={{
                              marginTop: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <input
                              type="file"
                              accept=".pdf, .doc, .docx, .png"
                              onChange={handleFileChange}
                              style={{
                                marginBottom: '10px',
                                padding: '8px',
                                border: '1px solid black',
                                borderRadius: '5px',
                                cursor: 'pointer',
                              }}
                            />
                            <button
                              onClick={handleAddRecordSubmit}
                              style={{
                                padding: '8px',
                                backgroundColor: '#05172b',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              )}
              {item.info.familyMemberName && (
                <div onClick={(e) => handlePatientClick(item, e)} style={patientInfoStyle}>
                  <strong style={labelStyle}>Reserver Name:</strong> {item.info.name}
                  <br />
                  <strong style={labelStyle}>For Family Member :</strong> {item.info.familyMemberName}
                  <br />
                  <strong style={labelStyle}>Appointment Date:</strong>{' '}
                  {item.info.date ? new Date(item.info.date).toLocaleDateString() : 'N/A'}

                  {selectedPatient === item && (
                    <div style={dropdownStyle}>

                      <strong style={labelStyle}>Age:</strong> {item.info.age}
                      <br />
                      <strong style={labelStyle}>Gender:</strong> {item.info.gender}
                      <br />

                      <strong style={labelStyle}>Health Records:</strong>{' '}
                      {item.info.healthRecords && item.info.healthRecords.map((record, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            onClick={() => handleHealthRecordClick(record)}
                          >
                            View Health Record {index + 1}
                          </a>
                        </li>

                      ))}
                      <br />
                      <div>
                        <button onClick={(e) => handleAddRecordClick(e)} style={buttonStyle}>
                          {showAddRecordForm ? 'Cancel' : 'Add Health Record'}
                        </button>
                        {showAddRecordForm && (
                          <div style={addRecordFormStyle}>
                            <input
                              type="file"
                              accept=".pdf, .doc, .docx, .png" // Adjust accepted file types as needed
                              onChange={handleFileChange}
                            />
                            <button onClick={handleAddRecordSubmit}>Submit</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <hr style={hrStyle} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Define your internal styling objects
const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: 'auto',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  width: '60%'
};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center'
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
  borderBottom: '1px solid #e4e4e4',
  margin: '10px 0',
};

const patientInfoStyle = {
  cursor: 'pointer',
};

const buttonStyle = {
  padding: '8px',
  margin: '10px 0',
  cursor: 'pointer',
  backgroundColor: 'gray',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
};

const addRecordFormStyle = {
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column',
};

export default PatientList;
