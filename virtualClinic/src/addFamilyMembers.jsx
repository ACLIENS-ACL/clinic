import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const styles = {
  form: {
    maxWidth: '300px',
    margin: '0 auto',
  },
  input: {
    width: '100%',
    marginBottom: '10px',
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
    axios.get('http://localhost:3001/get-user-gender')
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

    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type.toLowerCase() !== "patient" || !responseData.in) {
          navigate('/login');
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching user data.');
      });
  }, [navigate]);

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
        const response = await axios.put('http://localhost:3001/update-family-member', formData);
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
      <h1>Add Family Member</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            name="existingAccount"
            value="false"
            checked={!formData.existingAccount}
            onChange={handleInputChange}
          />
          Add a family member with no existing Account
        </label>
        <label>
          <input
            type="radio"
            name="existingAccount"
            value="true"
            checked={formData.existingAccount}
            onChange={handleInputChange}
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
          <option value="" disabled>Select Relation</option>
          {relations.map((rel, index) => (
            <option key={index} value={rel}>{rel}</option>
          ))}
        </select>
        <button type="submit">Add Family Member</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AddFamilyMemberForm;