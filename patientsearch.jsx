import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    console.log("Name:", name, "Specialty:", specialty);

    try {
      const response = await axios.get(`http://localhost:3001/search`, {
        params: { name, specialty }, // Use the correct variable name, which is 'specialty'
      });
      console.log("Response Data:", response.data);
      setResults(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <h1>Doctor Search</h1>
      <div>
        <input
          type="text"
          placeholder="Doctor's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Doctor's Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {results.map((doctor) => (
          <div key={doctor._id}>
            <p>Name: {doctor.name}</p>
            <p>Specialty: {doctor.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
