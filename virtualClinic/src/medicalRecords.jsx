import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Navbar from './navbar';
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
function MedicalHistory() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); // Initialize as an empty array
    const [username, setUsername] = useState(''); // Get the logged-in user's username
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

        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios GET request to fetch the user's medical records
            axios.get('http://localhost:3001/medicalRecords', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUploadedFiles(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error('User not authenticated');
        }

    }, []); // Add an empty dependency array to ensure this effect runs once on mount

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        axios.post('http://localhost:3001/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    // Refresh the list of uploaded files after a successful upload
                    axios.get('http://localhost:3001/medicalRecords')
                        .then((response) => {
                            setUploadedFiles(response.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDelete = (recordId) => {
        axios.delete(`http://localhost:3001/delete/${recordId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    // Remove the deleted file from the list
                    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file._id !== recordId));
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto' }}>
            <Navbar />
            <div style={{ width: '60vw', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <br></br>
                    <h2 style={{ color: '#333', marginBottom: '10px' }}>Medical Records</h2>
                    <br></br>
                    <div style={{ marginBottom: '20px', border: '1px black solid', borderRadius: '5px', padding: '20px', textAlign: 'left' }}>
                        <label style={{ fontSize: '18px', marginBottom: '10px', marginRight: '40px' }}>Add A Health Record:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ margin: '0 10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '500px', marginRight: '40px' }}
                        />
                        <button
                            onClick={handleUpload}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#097969'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'grey'}
                            style={{
                                backgroundColor: 'grey',
                                color: 'white',
                                padding: '10px 15px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                border: 'none',
                                width: '100px'
                            }}
                        >
                            Upload
                        </button>
                    </div>

                </div>

                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file) => (
                            <div>
                                <li
                                    key={file._id}
                                    style={{
                                        marginBottom: '10px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ddd',
                                        backgroundColor: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <a
                                        href={`http://localhost:3001/${file.filePath}`}
                                        download={file.fileName}
                                        style={{ marginRight: '10px', color: '#3498db', textDecoration: 'none' }}
                                    >
                                        Click to Download: {file.fileName}
                                    </a>


                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'grey'}
                                        style={{
                                            backgroundColor: 'grey',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            border: 'none',
                                        }}
                                    >
                                        Delete
                                    </button>

                                </li>
                                <DocViewer pluginRenderers={DocViewerRenderers} style={{ height: "500px", width: "500px", margin:" 20px auto", }} documents={[{ uri: `http://localhost:3001/${file.filePath}` }]} />
                            </div>
                        ))
                    ) : (
                        <p>No medical records found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MedicalHistory;