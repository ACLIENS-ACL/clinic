import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RemovePatients() {
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch patients from the server
    axios.get('http://localhost:3001/get-patients') // Replace with your API endpoint to fetch patients
      .then((response) => {
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching patients.');
      });
  }, []);

  const handleRemove = (patientId) => {
    // Send a request to remove the patient from the database
    axios.post(`http://localhost:3001/remove-patient/${patientId}`) // Replace with your API endpoint to remove patients
      .then(() => {
        // Update the local state to remove the deleted patient
        setPatients((prevPatients) => prevPatients.filter((patient) => patient._id !== patientId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the patient.');
      });
  };

  return (
    <div>
      <h2>Patients</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td>{patient.username}</td>
              <td>
                <button onClick={() => handleRemove(patient._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemovePatients;
