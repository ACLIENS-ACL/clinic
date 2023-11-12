import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function RemoveAdmins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "admin" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
  useEffect(() => {
    // Fetch admins from the server
    axios.get('http://localhost:3001/get-admins') 
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
      <Navbar/>
      <h2>Admins</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>
                <button onClick={() => handleRemove(admin._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RemoveAdmins;
