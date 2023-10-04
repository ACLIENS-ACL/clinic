// DoctorRequests.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

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
    <div>
      <h2>Doctor Requests</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Specialization:</strong> {request.specialization}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(request)
                .filter((key) => key !== 'password' && key !== 'enrolled' && key!== '__v' )
                .map((key) => (
                  <li key={key}>
                    {key}: {request[key]}
                  </li>
                ))}
            </ul>
            <button onClick={() => handleApprove(request._id)}>Approve</button>
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorRequests;
