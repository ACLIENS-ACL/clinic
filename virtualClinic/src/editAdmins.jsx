import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function RemoveAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');
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

      if (userType !== 'admin') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  useEffect(() => {
    // Fetch admins from the server
    axios.get('http://localhost:3001/get-admins', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching admins.');
      });
  }, []);

  const handleRemove = (adminId) => {
    // Send a request to remove the admin from the database
    axios.post(`http://localhost:3001/remove-admin/${adminId}`) // Replace with your API endpoint to remove admin
      .then(() => {
        // Update the local state to remove the deleted admin
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== adminId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the admin.');
      });
  };

  return (
    <div>
      <Navbar />
      <br></br>
      <h3 style={{ textAlign:'center' }}>List of Admins</h3>
      <br></br>
      {message && <div className="alert alert-danger">{message}</div>}
      <table style={{ width: '50%', textAlign:'center', margin:'auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontWeight:'bold' }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: '10px', fontWeight:'bold' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{admin.username}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                <button style={{
                  marginRight: '10px',
                  backgroundColor: 'gray',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease', // Add a smooth transition for the color change
                }} onClick={() => handleRemove(admin._id)} onMouseEnter={(e) => (e.target.style.backgroundColor = 'crimson')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemoveAdmins;
