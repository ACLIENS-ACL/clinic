import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RemoveAdmins() {
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');

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
