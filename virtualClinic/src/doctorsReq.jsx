import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const containerStyles = {
};

const headerStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'navy',
  marginBottom: '20px',
  textAlign: 'center'
};

const listItemStyles = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '15px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
};

const buttonStyles = {
  marginRight: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '3px',
  cursor: 'pointer',
};
const rejectButtonStyles = {
  backgroundColor: 'red', // Change the background color to red
  color: 'white', // Change the text color to white
  border: 'none',
  padding: '5px 10px',
  borderRadius: '3px',
  cursor: 'pointer',
};
function DoctorRequests() {

  const handleClick = (request) => {
    // Assuming `idDocument` is an object with a `fileName` property
    const filename = request;
    // Navigate to the document URL
    axios.get(`http://localhost:3001/uploads/${filename}`, { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
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

      if (userType !== 'admin') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  useEffect(() => {
    // Fetch doctor requests from the server
    axios.get('http://localhost:3001/doctor-requests')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching doctor requests.');
      });
  }, []);

  const handleApprove = (doctorId) => {
    // Send a request to approve the doctor
    axios.post(`http://localhost:3001/approve-doctor/${doctorId}`)
      .then(() => {
        // Update the local state to reflect the change
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== doctorId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while approving the doctor.');
      });
  };

  const handleReject = (doctorId) => {
    // Send a request to reject and remove the doctor
    axios.post(`http://localhost:3001/reject-doctor/${doctorId}`)
      .then(() => {
        // Update the local state to remove the rejected doctor
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== doctorId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while rejecting the doctor.');
      });
  };

  return (
    <div style={containerStyles}>
      <Navbar />
      <br></br>
      <h2 style={headerStyles}>Doctor Requests</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <ul style={{ width: '50%', margin: 'auto', listStyleType: 'none' }}>
        {requests.map((request) => (
          <li key={request._id} style={listItemStyles}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Specialization:</strong> {request.specialty === 'extraNotes' ? 'Professional Experience' : request.specialty}<br />

            {Object.keys(request)
              .filter(
                (key) =>
                  key !== 'password' &&
                  key !== 'enrolled' &&
                  key !== '__v' &&
                  key !== '_id' &&
                  key !== 'availableSlots' &&
                  key !== 'username' &&
                  key !== 'wallet' &&
                  key !== 'userType' &&
                  key !== 'extraNotes'
              )
              .map((key) => (
                <li key={key}>
                  <strong>
                    {key === 'extraNotes'
                      ? 'Professional Experience'
                      : key === 'idDocument'
                        ? 'ID Document'
                        : key === 'medicalDegree'
                          ? 'Medical Degree'
                          : key === 'medicalLicenses'
                            ? 'Medical Licenses'
                            : key === 'educationalBackground' ? 'Educational Background' : capitalizeFirstLetter(key)}
                  </strong>:{' '}
                  {key === 'dob' ? (
                    new Date(request[key]).toISOString().split('T')[0]
                  ) : key === 'idDocument' ? (
                    <a href="#" onClick={() => handleClick(request.idDocument.fileName)}>
                      View Document
                    </a>
                  ) : key === 'medicalDegree' ? (
                    <a href="#" onClick={() => handleClick(request.medicalDegree.fileName)}>
                      View Medical Degree
                    </a>
                  ) : key === 'medicalLicenses' ? (
                    <ul style={{ listStyleType: 'none' }}>
                      {request.medicalLicenses.map((license, index) => (
                        <li key={index}>
                          <a href="#" onClick={() => handleClick(license.fileName)}>
                            View License {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    request[key]
                  )}
                </li>

              ))}


            <button
              style={{
                marginRight: '10px',
                width: '80px',
                backgroundColor: 'gray',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
              onClick={() => handleApprove(request._id)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'green'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'gray'}
            >
              Approve
            </button>

            <button
              style={{
                backgroundColor: 'gray',
                width: '80px',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
              onClick={() => handleReject(request._id)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'crimson'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'gray'}
            >
              Reject
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default DoctorRequests;
