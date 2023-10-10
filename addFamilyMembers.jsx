import React, { useState } from 'react';

function AddFamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: '',
    nationalId: '',
    age: '',
    gender: '',
    relation: '',
  });

  const handleNameChange = (event) => {
    setNewMember((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleNationalIdChange = (event) => {
    setNewMember((prevState) => ({
      ...prevState,
      nationalId: event.target.value,
    }));
  };

  const handleAgeChange = (event) => {
    setNewMember((prevState) => ({
      ...prevState,
      age: event.target.value,
    }));
  };

  const handleGenderChange = (event) => {
    setNewMember((prevState) => ({
      ...prevState,
      gender: event.target.value,
    }));
  };

  const handleRelationChange = (event) => {
    setNewMember((prevState) => ({
      ...prevState,
      relation: event.target.value,
    }));
  };

  const handleAddMember = () => {
    if (
      newMember.relation === 'wife' ||
      newMember.relation === 'husband' ||
      newMember.relation === 'child'
    ) {
      setFamilyMembers((prevMembers) => [...prevMembers, newMember]);
      setNewMember({
        name: '',
        nationalId: '',
        age: '',
        gender: '',
        relation: '',
      });
    } else {
      alert('Please enter a valid relation (wife, husband, or child).');
    }
  };

  return (
    <div>
      <h2>Add Family Member</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={handleNameChange}
        />
        <input
          type="text"
          placeholder="National ID"
          value={newMember.nationalId}
          onChange={handleNationalIdChange}
        />
        <input
          type="text"
          placeholder="Age"
          value={newMember.age}
          onChange={handleAgeChange}
        />
        <input
          type="text"
          placeholder="Gender"
          value={newMember.gender}
          onChange={handleGenderChange}
        />
        <input
          type="text"
          placeholder="Relation (wife/husband/child)"
          value={newMember.relation}
          onChange={handleRelationChange}
        />
        <button onClick={handleAddMember}>Add</button>
      </div>
      <h3>Family Members</h3>
      <ul>
        {familyMembers.map((member, index) => (
          <li key={index}>
            Name: {member.name}, National ID: {member.nationalId}, Age: {member.age}, Gender: {member.gender}, Relation: {member.relation}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddFamilyMembers;
import axios from 'axios';

// ...

const handleAddMember = () => {
  // Prepare the data to be sent to the server
  const data = {
    name: newMember.name,
    nationalId: newMember.nationalId,
    age: newMember.age,
    gender: newMember.gender,
    relation: newMember.relation,
  };

  // Send a POST request to the server
  axios.post('/api/family/add', data)
    .then((response) => {
      // Handle the response from the server
      console.log(response.data); // You can do something with the response if needed
      setFamilyMembers((prevMembers) => [...prevMembers, newMember]);
      setNewMember({
        name: '',
        nationalId: '',
        age: '',
        gender: '',
        relation: '',
      });
    })
    .catch((error) => {
      // Handle any error that occurred during the request
      console.error(error);
    });
};