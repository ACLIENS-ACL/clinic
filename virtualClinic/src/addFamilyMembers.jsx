import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const relations = ["Mother", "Father", "Sibling", "Spouse", "Child", "Other"];

const AddFamilyMemberForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nationalID: '',
    age: '',
    gender: 'female',
    relation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        });
      }
    } catch (error) {
      setError('An error occurred while updating family members.');
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Add Family Member</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
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