import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorRegistrationForm() {
  const [doctorInfo, setDoctorInfo] = useState({});
  const [notes, setNotes] = useState('');
  const [formModified, setFormModified] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/get-doctor-info')
      .then((response) => {
        setDoctorInfo(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setDoctorInfo({
      ...doctorInfo,
      [e.target.name]: e.target.value,
    });
    setFormModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a data object to send to the server
    const requestData = {
      ...doctorInfo,
      notes,
      enrolled: 'Pending',
    };

    try {
      // Send a POST request to your server to update the doctor's information
      await axios.put('http://localhost:3001/update-doctor-info', requestData);

      setFormModified(false);

      // Optionally, you can display a success message to the user
      alert('Registration request submitted successfully.');
    } catch (error) {
      console.error('Error:', error);

      // Handle errors, e.g., display an error message to the user
      alert('An error occurred while submitting the registration request.');
    }
  };

  return (
    <div>
      <h1>Doctor Registration</h1>
      <form onSubmit={handleSubmit}>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={doctorInfo.name || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={doctorInfo.email || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Date of Birth:</label>
        <input
          type="text"
          name="dob"
          value={doctorInfo.dob || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={doctorInfo.gender || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={doctorInfo.mobileNumber || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Specialty:</label>
        <input
          type="text"
          name="specialty"
          value={doctorInfo.specialty || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Hourly Rate:</label>
        <input
          type="text"
          name="hourlyRate"
          value={doctorInfo.hourlyRate || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Affiliation:</label>
        <input
          type="text"
          name="affiliation"
          value={doctorInfo.affiliation || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Educational Background:</label>
        <input
          type="text"
          name="educationalBackground"
          value={doctorInfo.educationalBackground || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Extra Notes:</label>
        <textarea
          name="extraNotes"
          value={doctorInfo.extraNotes || ''}
          onChange={handleInputChange}
          rows="4"
          cols="50"
        ></textarea>
        <br />

        <button type="submit" disabled={!formModified}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default DoctorRegistrationForm;