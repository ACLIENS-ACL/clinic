// src/components/PatientPrescriptions.js

import React, { useState } from 'react';
import axios from 'axios';

const PatientPrescriptions = () => {
  const [patientID, setPatientID] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');

  const handlePatientIDChange = (event) => {
    setPatientID(event.target.value);
  };

  const getPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/get-prescriptions/${patientID}`);
      setPrescriptions(response.data);
    } catch (err) {
      setError('No prescriptions found for the patient');
    }
  };

  return (
    <div>
      <h2>Get Prescriptions by Patient ID</h2>
      <input
        type="text"
        placeholder="Enter Patient ID"
        value={patientID}
        onChange={handlePatientIDChange}
      />
      <button onClick={getPrescriptions}>Get Prescriptions</button>
      {error && <p>{error}</p>}
      {prescriptions.length > 0 && (
        <ul>
          {prescriptions.map((prescription) => (
            <li key={prescription._id}>
              <strong>Prescription ID:</strong> {prescription._id}<br />
              <strong>Date:</strong> {new Date(prescription.Date).toLocaleString()}<br />
              <strong>Medicines:</strong> {prescription.medicines}<br />
              <strong>Status:</strong> {prescription.Status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default PatientPrescriptions;
