import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function PrescriptionList() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with your actual key

      if (!token) {
        // If the token doesn't exist, navigate to the login page
        navigate('/login');
        return;
      }

      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.type.toLowerCase();

      if (userType !== 'patient') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filterOption, setFilterOption] = useState('all'); // Initialize with 'all'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    presc();
  }, []);
  const presc = async () => {
    const token = localStorage.getItem('token');
    await axios
      .get('http://localhost:3001/get-prescriptions/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data); // Initialize filteredPrescriptions with all prescriptions
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }
  const containerStyle = {
    width: '55%',
    margin: '0 auto',
    padding: '20px',
  };
  const headingStyle = {
    fontSize: '30px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const filterContainerStyle = {
    marginBottom: '20px',
  };

  const dateFilterContainerStyle = {
    display: 'flex',
    marginBottom: '20px',
  };

  const filterSelectStyle = {
    marginLeft: '20px',
    width: '150px',
    marginRight: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  };

  const dateInputStyle = {
    marginRight: '15px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',

  };

  const clearButtonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    width: "100px"
  };

  const prescriptionListStyle = {
    listStyle: 'none',
    padding: '0',
  };

  const listItemStyle = {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const detailsStyle = {
    marginTop: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const downloadLinkStyle = {
    color: '#3498db',
    textDecoration: 'none',
    marginLeft: '5px',
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
  const handlePayment = () => {
    navigate(`/cart/${selectedPrescription._id}`);
  };
  const filterPrescriptions = (status, startDate, endDate) => {
    // Apply filtering based on the selected filter options
    let filteredPrescriptionList = prescriptions;

    if (status === 'filled') {
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => p.filled
      );
    } else if (status === 'unfilled') {
      filteredPrescriptionList = filteredPrescriptionList.filter(
        (p) => !p.filled
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
          return prescriptionTimestamp < endTimestamp + 24 * 60 * 60 * 1000;
        }
      );
    }

    setFilteredPrescriptions(filteredPrescriptionList);
  };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={headingStyle}>Prescriptions</h1>
        <div style={filterContainerStyle}>
          <label htmlFor="filter">Filter by status:</label>
          <select id="filter" style={filterSelectStyle} value={filterOption} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="filled">Filled</option>
            <option value="unfilled">Unfilled</option>
          </select>
        </div>
        <div style={dateFilterContainerStyle}>
          <div>
            <label htmlFor="filter" style={{ marginRight: "40px" }}>Filter by Dates/</label>
            <label htmlFor="startDate" style={{ marginRight: "10px" }}>Start Date:</label>
            <input type="date" id="startDate" style={dateInputStyle} value={startDate} onChange={handleStartDateChange} />
          </div>
          <div>
            <label htmlFor="endDate" style={{ marginRight: "10px" }}>End Date:</label>
            <input type="date" id="endDate" style={dateInputStyle} value={endDate} onChange={handleEndDateChange} />
          </div>
          <button onClick={handleClear} style={clearButtonStyle}>
            Clear
          </button>
        </div>
        {filteredPrescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <ul style={prescriptionListStyle}>
            {filteredPrescriptions.map((prescription) => (
              <li key={prescription._id} style={listItemStyle} onClick={() => handlePrescriptionSelect(prescription)}>
                <h2>Date: {new Date(prescription.date).toLocaleString()}</h2>
                <p style={{ fontSize: '16px' }}><strong>Status:</strong> {prescription.filled ? 'Filled' : 'Not Filled'}</p>
                {selectedPrescription === prescription && (
                  <div style={detailsStyle}>
                    <h3>Prescription Details</h3>
                    <p><strong>Doctor Name: </strong>{selectedPrescription.doctorName}</p>
                    <div style={{ border: '1px solid black', borderRadius: '5px' }}>
                      <p style={{ fontSize: '18px', paddingTop: '15px', paddingLeft: '15px', marginBottom: '0' }}><strong>Medicines:</strong></p>
                      <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {selectedPrescription.medicines.map((medicine, index) => (
                          <li key={index} style={{ borderBottom: '1px solid #ddd', padding: '5px 40px' }}>
                            <p><strong>Name: </strong>{medicine.name}</p>
                            <p><strong>Dose:</strong> {medicine.dose.daily} times per day for {medicine.dose.days} day(s)</p>
                            {!medicine.pharmacy && (
                              <p>
                                <strong>
                                  <em style={{ color: 'black', fontStyle: 'italic', fontSize:'14px' }}>
                                    **This medicine is unavailable on the pharmacy platform
                                  </em>
                                </strong>
                              </p>)
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p style={{ fontSize: '16px', paddingTop: '15px' }}>
                      Download Prescription as PDF:
                      <a href={`http://localhost:3001/uploads/${encodeURIComponent(selectedPrescription.fileName)}`} style={downloadLinkStyle} download>
                        Download Link
                      </a>
                      {!prescription.filled && (
                        <button onClick={handlePayment}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#27ae60')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}
                          style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            padding: '10px 15px',
                            borderRadius: '4px',
                            marginTop: '-5px',
                            cursor: 'pointer',
                            border: 'none',
                            float: 'right'
                          }}>
                          Order Now
                        </button>
                      )}
                    </p>

                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PrescriptionList;

