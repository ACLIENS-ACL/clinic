import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddPrescription = () => {
  const [prescriptionData, setPrescriptionData] = useState({
    patientID: '',
    doctorID: '', 
    Date: null,
    medicines: '', 
    Status: '' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData({ ...prescriptionData, [name]: value });
  };

  const handleDateChange = (date) => {
    setPrescriptionData({ ...prescriptionData, Date: date });
  };

  const handleAddPrescription = async () => {
    try {
      await axios.post('/pre', prescriptionData);
      alert('Prescription added successfully');
    } catch (error) {
      console.error('Error: ', error.message);
      alert('An error occurred while adding the prescription');
    }
  };

  return (
    <div>
      <h2>Add Prescription</h2>
      <div className="form-group">
        <label>Patient ID:</label>
        <input type="text" name="patientID" onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Doctor ID:</label>
        <input type="text" name="doctorID" onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Date:</label>
        <DatePicker
          selected={prescriptionData.Date}
          onChange={handleDateChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Medicines:</label>
        <input type="text" name="medicines" onChange={handleInputChange} />
      </div>
      <div className="form-group">
        <label>Status:</label>
        <select name="Status" onChange={handleInputChange}>
          <option value="unfilled">Unfilled</option>
          <option value="filled">Filled</option>
        </select>
      </div>
      <button onClick={handleAddPrescription}>Add Prescription</button>
    </div>
  );
};

export default AddPrescription;
