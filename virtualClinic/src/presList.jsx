import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PrescriptionList() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "patient" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filterOption, setFilterOption] = useState('all'); // Initialize with 'all'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/get-prescriptions/')
      .then((response) => {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data); // Initialize filteredPrescriptions with all prescriptions
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  };

  const headingStyle = {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  };

  const listItemStyle = {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    position: 'relative',
  };

  const detailsStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'lightgray',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    display: selectedPrescription ? 'block' : 'none',
    zIndex: 1,
  };
  
  const handlePrescriptionSelect = (prescription) => {
    if (selectedPrescription === prescription) {
      setSelectedPrescription(null); // Deselect if already selected
    } else {
      setSelectedPrescription(prescription);
    }
  };

  const handleFilterChange = (e) => {
    const selectedOption = e.target.value;
    setFilterOption(selectedOption);

    // Apply filtering based on the selected filter option
    filterPrescriptions(selectedOption, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Apply filtering based on the selected filter options
    filterPrescriptions(filterOption, newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    // Apply filtering based on the selected filter options
    filterPrescriptions(filterOption, startDate, newEndDate);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    // Clear both start and end date inputs
    filterPrescriptions('all', '', ''); // Reset the filter
  };

  const filterPrescriptions = (status, startDate, endDate) => {
    // Apply filtering based on the selected filter options
    let filteredPrescriptionList = prescriptions;

    if (status === 'filled') {
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => p.status === 'filled'
      );
    } else if (status === 'unfilled') {
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => p.status === 'unfilled'
      );
    }

    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => {
          const prescriptionTimestamp = new Date(p.date).getTime();
          return prescriptionTimestamp >= startTimestamp;
        }
      );
    }

    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => {
          const prescriptionTimestamp = new Date(p.date).getTime();
          return prescriptionTimestamp < endTimestamp+ 24 * 60 * 60 * 1000;
        }
      );
    }

    setFilteredPrescriptions(filteredPrescriptionList);
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Prescriptions</h1>
      <div>
        <label htmlFor="filter">Filter by status:</label>
        <select id="filter" value={filterOption} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="filled">Filled</option>
          <option value="unfilled">Unfilled</option>
        </select>
      </div>
      <div style={{ display: 'flex' }}>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <button onClick={handleClear}>Clear</button> {/* Single "Clear" button */}
      </div>
      {filteredPrescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul>
          {filteredPrescriptions.map((prescription) => (
            <li
              key={prescription._id}
              style={listItemStyle}
              onClick={() => handlePrescriptionSelect(prescription)}
            >
              <h2>Date: {new Date(prescription.date).toLocaleString()}</h2>
              <p>Status: {prescription.status}</p>
              {selectedPrescription === prescription && (
                <div style={detailsStyle}>
                  <h2>Prescription Details</h2>
                  <p>Doctor Name: {selectedPrescription.doctorName}</p>
                  <ul>
                    {selectedPrescription.medicines.map((medicine, index) => (
                      <li key={index}>
                        <p>Name: {medicine.name}</p>
                        <p>Type: {medicine.type}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PrescriptionList;

