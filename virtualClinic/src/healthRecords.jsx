import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import Navbar from './navbar';

function HealthRecordsView() {
    const [healthRecords, setHealthRecords] = useState([]);
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);

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

        }
    }, [navigate]);
    /*const handleHealthRecordClick = (filePath) => {

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
    };*/

    useEffect(() => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios GET request to fetch the patient's health records
            axios.get('http://localhost:3001/get-health-records/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    // Set the health records in the state
                    setHealthRecords(response.data);
                    // Assuming each health record has a 'uri' property
                    const newDocs = response.data.map(record => ({ uri: `http://localhost:3001/${record}` }));
                    setDocs(newDocs);
                })

                .catch(error => {
                    console.error(error);
                });
        }
    }, []);


    return (
        <div style={{ height: "60vh" }} >
            <Navbar />
            <br></br>
            <h2 style={{ textAlign: 'center' }}>Health Records</h2>
            <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} style={{ height: "70vh", width: "80vw", margin: "auto" }} />
            <div style={{ width: "80vw", margin: "auto" }}>
                <br></br>
                <h4 style={{ textAlign: 'left' }}>Or Directly download Health records through: </h4>
                {healthRecords.length === 0 ? (
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        No health records available for this patient.
                    </p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {healthRecords.map((record, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <a
                                    href={`http://localhost:3001/${record}`}
                                    onClick={() => handleHealthRecordClick(record)}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#0066cc',
                                        cursor: 'pointer',
                                        fontSize:'18px',

                                    }}
                                >
                                    Download Health Record {index + 1}: {record.split('\\').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
<br></br>
            </div>
        </div>
    );
}

export default HealthRecordsView;
