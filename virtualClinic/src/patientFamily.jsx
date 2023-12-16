import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: 'auto',
  border: '1px solid #ccc',
  marginTop: '0', // Add this line to remove the white space above
};

const headerStyle = {
  fontSize: '24px',
  color: '#333',
  textAlign: 'center',
  marginBottom: '20px',
  marginTop: '30px'
};

const listStyle = {
  listStyleType: 'none',
  padding: '0',
  margin: '0 200px'
};

const listItemStyle = {
  margin: '15px 0',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  background: '#fff',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
};

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
};

const dividerStyle = {
  margin: '20px 0',
  borderBottom: '1px solid #ccc',
};

function PatientFamilyMembers() {
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

  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/view-family-members', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setFamilyMembers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

  if (error) {
    return <div style={containerStyle}>Error: {error.message}</div>;
  }
  return (
    <div style={containerStyle}>
      <Navbar />
      <h1 style={headerStyle}>Family Members</h1>
      {familyMembers.length === 0 ? (
        <p>No family members found.</p>
      ) : (
        <ul style={listStyle}>
          {familyMembers.map((familyMember, index) => (
            <li key={index} style={listItemStyle}>
              <strong style={labelStyle}>Name:</strong> {familyMember.name}<br />
              <strong style={labelStyle}>National ID:</strong> {familyMember.nationalID}<br />
              <strong style={labelStyle}>Age:</strong> {familyMember.age}<br />
              <strong style={labelStyle}>Gender:</strong> {familyMember.gender}<br />
              <strong style={labelStyle}>Relation:</strong> {familyMember.relation}<br />
            </li>
          ))}
        </ul>
      )}
      {familyMembers.length > 0 && <div style={dividerStyle}></div>}
    </div>
  );
}

export default PatientFamilyMembers;
