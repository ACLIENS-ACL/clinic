import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";


const styles = {
  form: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '500px',
    margin: 'auto',
    padding: '20px',
    marginTop: '50px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
  },
  radioInput: {
    marginRight: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '12px 0',
    boxSizing: 'border-box',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: 'navy',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '20px', // Adjust the radius as needed
    cursor: 'pointer',
    display: 'block',
    margin: 'auto',
  },
};


const AddFamilyMemberForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nationalID: '',
    age: '',
    gender: 'female',
    relation: '',
    existingAccount: false,
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [relations, setRelations] = useState([]);
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
      setError('An error occurred while decoding the token.');
    }
  }, [navigate]);

  useEffect(() => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    if (token) {
      // Use the token to send a request to get user gender
      axios.get('http://localhost:3001/get-user-gender', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const gender = response.data.gender;
          // Define relations based on gender
          if (gender.toLowerCase() === 'male') {
            setRelations(['Wife', 'Child']);
          } else if (gender.toLowerCase() === 'female') {
            setRelations(['Husband', 'Child']);
          }
        })
        .catch((error) => {
          // Handle errors
          console.error('Error:', error);
        });
    }
  }, []); // The empty dependency array ensures that this effect runs once after the initial render


  const handleInputChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'radio') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    // Check if the patient wants to add a family member with an existing account
    if (formData.existingAccount) {
      // Handle adding a family member with an existing account (provide email or phone number)
      if (formData.email === '' && formData.phone === '') {
        setError('Please provide either an email or phone number for the family member.');
        setMessage('');
        return;
      }

      // Send a request to the server to add a family member with an existing account
      try {
        const response = await axios.put('http://localhost:3001/add-existing-family-member', {
          email: formData.email,
          phone: formData.phone,
          relation: formData.relation,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setMessage(response.data.message);
          setError('');
        }
      } catch (error) {
        setError('An error occurred while adding the family member.');
        setMessage('');
      }
    } else {
      // Handle adding a family member without an existing account
      const { name, nationalID, age, relation } = formData;

      if (name === '' || nationalID === '' || age === '' || relation === '') {
        setError('Please fill in all required fields.');
        setMessage('');
        return;
      }

      if (parseInt(age) < 0) {
        setError('Age cannot be negative.');
        setMessage('');
        return;
      }

      // Send a request to the server to add a family member without an existing account
      try {
        const response = await axios.put('http://localhost:3001/update-family-member', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setMessage(response.data.message);
          setError('');
          setFormData({
            name: '',
            nationalID: '',
            age: '',
            gender: 'female',
            relation: '',
            existingAccount: false,
            email: '',
            phone: '',
          });
        }
      } catch (error) {
        setError('An error occurred while adding the family member.');
        setMessage('');
      }
    }
  };

  return (
    <div>
      <Navbar />

      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>Add Family A Member</h3>
        <label style={styles.label}>
          <input
            type="radio"
            name="existingAccount"
            value="false"
            checked={!formData.existingAccount}
            onChange={handleInputChange}
            style={styles.radioInput}
          />
          Add a family member with no existing account
        </label>
        <label style={styles.label}>
          <input
            type="radio"
            name="existingAccount"
            value="true"
            checked={formData.existingAccount}
            onChange={handleInputChange}
            style={styles.radioInput}
          />
          Use an existing account for the family member
        </label>
        {formData.existingAccount ? (
          <>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="text"
              name="nationalID"
              placeholder="National ID"
              value={formData.nationalID}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              style={styles.input}
              required
              min="0"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </>
        )}
        <select
          name="relation"
          value={formData.relation}
          onChange={handleInputChange}
          style={styles.input}
          required
        >
          <option value="" disabled>
            Select Relation
          </option>
          {relations.map((rel, index) => (
            <option key={index} value={rel}>
              {rel}
            </option>
          ))}
        </select>
        {message && <p>{message}</p>}
        <button type="submit" style={styles.button}>
          Add Family Member
        </button>
        
      </form>;

      
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddFamilyMemberForm;