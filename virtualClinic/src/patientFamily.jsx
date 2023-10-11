import React, { useState, useEffect } from 'react';
import axios from 'axios';

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  margin: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center', // Add this line to center align the text
  };

const listItemStyle = {
  marginBottom: '20px',
  border: '1px solid #ccc',
  padding: '15px',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
};

const labelStyle = {
  fontWeight: 'bold',
};

const dividerStyle = {
  borderTop: '1px solid #ccc',
  margin: '15px 0',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

function PatientFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/view-family-members')
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
              <strong style={labelStyle}>Relationship:</strong> {familyMember.relation}<br />
            </li>
          ))}
        </ul>
      )}
      {familyMembers.length > 0 && <div style={dividerStyle}></div>}
    </div>
  );
}

export default PatientFamilyMembers;
