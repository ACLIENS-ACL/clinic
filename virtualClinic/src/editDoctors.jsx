import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RemoveDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch doctors from the server
    axios.get('http://localhost:3001/get-doctors') // Update the API endpoint to fetch doctors
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching doctors.');
      });
  }, []);

  const handleRemove = (doctorId) => {
    // Send a request to remove the doctor from the database
    axios.post(`http://localhost:3001/remove-doctor/${doctorId}`) // Update the API endpoint to remove doctors
      .then(() => {
        // Update the local state to remove the deleted doctor
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== doctorId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the doctor.');
      });
  };

  return (
    <div>
      <h2>Doctors</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>{doctor.username}</td>
              <td>
                <button onClick={() => handleRemove(doctor._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemoveDoctors;
