import React, { useState } from 'react'; // Add this line at the beginning of your file
import axios from 'axios'; // Add this line at the beginning of your file

const FilterComponent = () => {
    const [specialty, setSpecialty] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [results, setResults] = useState([]);
  
    const handleFilter = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/filter`);
        setResults(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Doctor's Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
  
        {results.map((doctor) => (
          <div key={doctor._id}>
            <p>Name: {doctor.name}</p>
            <p>Specialty: {doctor.specialty}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default FilterComponent;