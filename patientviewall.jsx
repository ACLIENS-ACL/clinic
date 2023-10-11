import React, { useState } from 'react';
import axios from 'axios';

const SelectedDoctor = () => {
  const [doctorName, setDoctorName] = useState(''); // Changed state variable to 'doctorName'
  const [doctorDetails, setDoctorDetails] = useState(null);

  const handleGetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/selected/${doctorName}`); // Changed endpoint to use doctorName
      setDoctorDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Selected Doctor Details</h2>
      <div>
        <input
          type="text"
          placeholder="Doctor's name" // Changed placeholder to reflect input type
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)} // Changed state variable to 'doctorName'
        />
        <button onClick={handleGetDetails}>Get Details</button>
      </div>
      {doctorDetails && (
        <div>
          <p>Name: {doctorDetails.name}</p>
          <p>Specialty: {doctorDetails.specialty}</p>
          <p>Affiliation: {doctorDetails.affiliation}</p>
          <p>Educational Background: {doctorDetails.educationalBackground}</p>
        </div>
      )}
    </div>
  );
};

export default SelectedDoctor;
