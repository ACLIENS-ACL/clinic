import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


function HealthRecordsView() {
    const [healthRecords, setHealthRecords] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch admin data from the server
        axios.get(`http://localhost:3001/get-user-type`).then((response) => {
            const responseData = response.data;
            if (responseData.type !== 'patient' || responseData.in !== true) {
                navigate('/login');
                return null;
            }
        });
    }, []);
    const handleHealthRecordClick = (filePath) => {
        const fileName = filePath.split('\\').pop();
        axios.get(`http://localhost:3001/uploads/${fileName}`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        // Fetch health records for the patient
        axios.get(`http://localhost:3001/get-health-records/`)
            .then(response => {
                setHealthRecords(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    });

    return (
        <div>
            <h2>Health Records</h2>
            {healthRecords.length === 0 ? (
                <p>No health records available for this patient.</p>
            ) : (
                <ul>
                    {healthRecords.map((record, index) => (
                        <li key={index}>
                            <a href="#" onClick={() => handleHealthRecordClick(record)}>
                                View Health Record {index + 1}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HealthRecordsView;
