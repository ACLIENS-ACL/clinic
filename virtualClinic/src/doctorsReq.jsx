import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const containerStyles = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  background: '#f8f9fa',
  border: '1px solid #ced4da',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const headerStyles = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#007BFF',
  marginBottom: '20px',
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
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "admin" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
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
      <h2 style={headerStyles}>Doctor Requests</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <ul>
        {requests.map((request) => (
          <li key={request._id} style={listItemStyles}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Specialization:</strong> {request.specialty === 'extraNotes' ? 'Professional Experience' : request.specialty}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(request)
                .filter(
                  (key) =>
                    key !== 'password' &&
                    key !== 'enrolled' &&
                    key !== '__v' &&
                    key !== '_id' &&
                    key !== 'availableSlots' &&
                    key !== 'username' &&
                    key !== 'wallet'
                )
                .map((key) => (
                  <li key={key}>
                    {key === 'extraNotes' ? 'Professional Experience' : key === 'idDocument' ? 'ID Document' : key ==='medicalDegree'? 'Medical Degree' : key ==='medicalLicenses'? 'Medical Licenses' : key}:
                    {key === 'dob'
                      ? new Date(request[key]).toISOString().split('T')[0]
                      : key === 'idDocument' ? (
                        <a href="#" onClick={() => handleClick(request.idDocument.fileName)}>
                          View Document
                        </a>
                      ) : key === 'medicalDegree' ? (
                        <a href="#" onClick={() => handleClick(request.medicalDegree.fileName)}>
                          View Medical Degree
                        </a>
                      ) : key === 'medicalLicenses' ? (
                        <ul>
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

            </ul>
            <button style={buttonStyles} onClick={() => handleApprove(request._id)}>Approve</button>
            <button style={rejectButtonStyles} onClick={() => handleReject(request._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorRequests;
