import React, { useState } from 'react';
import axios from 'axios';

const DoctorSelection = () => {
  const [doctorName, setDoctorName] = useState(''); // Changed from doctorId to doctorName
  const [patientUsername, setPatientUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSelect = async () => {
    try {
      const response = await axios.post('http://localhost:3001/select', {
        doctorName, // Changed from doctorId to doctorName
        patientUsername,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Doctor Selection</h2>
      <div>
        <input
          type="text"
          placeholder="Doctor's Name" // Changed from ID to Name
          value={doctorName} // Changed from doctorId to doctorName
          onChange={(e) => setDoctorName(e.target.value)} // Changed from setDoctorId to setDoctorName
        />
        <input
          type="text"
          placeholder="Patient's Username"
          value={patientUsername}
          onChange={(e) => setPatientUsername(e.target.value)}
        />
        <button onClick={handleSelect}>Select Doctor</button>
      </div>
      <div>{message && <p>{message}</p>}</div>
    </div>
  );
};

export default DoctorSelection;
