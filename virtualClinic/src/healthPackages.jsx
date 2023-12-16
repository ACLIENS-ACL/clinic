import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

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
  const ulStyle = {
    listStyleType: 'none', // Add this line to remove bullet points
    padding: '0',
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
    <div style={containerStyle}>
      <Navbar />

      <div style={formContainerStyle}>
        <br></br>
        <h4 style={sectionHeadingStyle}>Add A New Package</h4>
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
          <button
            type="submit"
            style={{
              backgroundColor: 'gray',
              color: '#fff',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: 'none',
              width: '100px',
              transition: 'background-color 0.3s ease', // Add a smooth transition for the color change
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'green')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'gray')}
          >
            Add
          </button>
        </form>
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

const containerStyle = {
  margin: '0 auto',
  fontFamily: 'Arial, sans-serif',
  borderRadius: '8px',
};

const formContainerStyle = {
  marginBottom: '20px',
  width: '40%',
  margin: 'auto'
};

const sectionHeadingStyle = {
  borderBottom: '2px solid #333',
  paddingBottom: '10px',
  marginBottom: '20px',
};

const formLabelStyle = {
  display: 'block',
  margin: '10px 0',
  color: '#333',
};

const formInputStyle = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const formButtonStyle = {
  backgroundColor: 'gray',
  color: '#fff',
  padding: '10px 15px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: 'none',
  width: '100px',
};

const listItemStyle = {
  marginBottom: '15px',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#fff',
};

const editButtonStyle = {
  backgroundColor: '#2196F3',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: '4px',
  marginRight: '8px',
  cursor: 'pointer',
  border: 'none',
};

const deleteButtonStyle = {
  backgroundColor: '#f44336',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: 'none',
};
export default HealthPackages;
