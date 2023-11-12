import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

function HealthPackages() {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    package: 'Silver',
    cost: 0,
    doctorSessionDiscount: 0,
    medicinesDiscount: 0,
    familyMemberDiscount: 0,
  });
  const [editingPackageId, setEditingPackageId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch existing health packages from the server and set them to the state.
    axios.get('http://localhost:3001/health-packages')
      .then((response) => setPackages(response.data))
      .catch((error) => console.error(error));
  }, []);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackageId === null) {
      // Create a new health package
      axios.post('http://localhost:3001/health-packages', formData)
        .then((response) => {
          setPackages(response.data);
          clearForm();
        })
        .catch((error) => console.error(error));
    } else {
      // Update an existing health package
      axios.put(`http://localhost:3001/health-packages/${editingPackageId}`, formData)
        .then((response) => {
          setPackages(response.data);
          clearForm();
        })
        .catch((error) => console.error(error));
    }
  };

  const handleEdit = (packageId) => {
    // Set the form data for editing the selected health package
    const selectedPackage = packages.find((pkg) => pkg._id === packageId);
    setFormData(selectedPackage);
    setEditingPackageId(packageId);
  };

  const handleDelete = (packageId) => {
    // Send a DELETE request to the server to delete a health package.
    axios.delete(`http://localhost:3001/health-packages/${packageId}`)
      .then((response) => {
        setPackages(response.data);
        clearForm();
      })
      .catch((error) => console.error(error));
  };

  const clearForm = () => {
    // Clear the form data and reset editingPackageId
    setFormData({
      package: 'Silver',
      cost: 0,
      doctorSessionDiscount: 0,
      medicinesDiscount: 0,
      familyMemberDiscount: 0,
    });
    setEditingPackageId(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Navbar/>
      <h1>Health Packages</h1>
      <div>
        <h2>Ad/Update Package</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Package:
          <select
            name="package"
            value={formData.package}
            onChange={(e) => setFormData({ ...formData, package: e.target.value })}
            style={inputStyle}
          >
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </label>
        <label style={labelStyle}>
          Cost:
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
            style={inputStyle}
            min="0"
          />
        </label>
        <label style={labelStyle}>
          Doctor Session Discount:
          <input
            type="number"
            name="doctorSession"
            value={formData.doctorSessionDiscount}
            onChange={(e) => setFormData({ ...formData, doctorSessionDiscount: Number(e.target.value) })}
            style={inputStyle}
            min="0"
            max="100"
          />
        </label>
        <label style={labelStyle}>
          Medicines Discount:
          <input
            type="number"
            name="medicinesDiscount"
            value={formData.medicinesDiscount}
            onChange={(e) => setFormData({ ...formData, medicinesDiscount: Number(e.target.value) })}
            style={inputStyle}
            min="0"
            max="100"
          />
        </label>
        <label style={labelStyle}>
          Family Member Discount:
          <input
            type="number"
            name="familyDiscount"
            value={formData.familyMemberDiscount}
            onChange={(e) => setFormData({ ...formData, familyMemberDiscount: Number(e.target.value) })}
            style={inputStyle}
            min="0"
            max="100"
          />
        </label>
        <button type="submit" style={buttonStyle}>
          {editingPackageId ? 'Update' : 'Add'}
        </button>
      </form>
      </div>
      <div>
        <h2>Edit Package</h2>
      <ul style={listStyle}>
        {packages.map((pkg) => (
          <li key={pkg._id} style={listItemStyle}>
          <div>
            <strong>Package Name:</strong> {pkg.package}
          </div>
          <div>
            <strong>Cost:</strong> {pkg.cost}
          </div>
          <div>
            <strong>Doctor Session Discount:</strong> {pkg.doctorSessionDiscount}
          </div>
          <div>
            <strong>Medicines Discount:</strong> {pkg.medicinesDiscount}
          </div>
          <div>
            <strong>Family Member Discount:</strong> {pkg.familyMemberDiscount}
          </div>
          <button onClick={() => handleEdit(pkg._id)} style={editButtonStyle}>
            Edit
          </button>
          <button onClick={() => handleDelete(pkg._id)} style={deleteButtonStyle}>
            Delete
          </button>
        </li>
       
        
        ))}
      </ul>
      </div>
    </div>
  );
}

// Define inline styles
const labelStyle = {
  display: 'block',
  marginBottom: '5px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

const listStyle = {
  listStyle: 'none',
  padding: '0',
};

const listItemStyle = {
  marginBottom: '10px',
};

const editButtonStyle = {
  padding: '5px 10px',
  marginLeft: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '5px 10px',
  marginLeft: '10px',
  backgroundColor: '#ff0000',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

export default HealthPackages;
