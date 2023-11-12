import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function MedicalHistory() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]); // Initialize as an empty array
    const [username, setUsername] = useState(''); // Get the logged-in user's username
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
    useEffect(() => {
        // Fetch the user's medical records when the component mounts
        axios.get('http://localhost:3001/medicalRecords')
            .then((response) => {
                setUploadedFiles(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []); // Add an empty dependency array to ensure this effect runs once on mount

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        axios.post('http://localhost:3001/upload', formData)
            .then((response) => {
                alert(formData);
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
        axios.delete(`http://localhost:3001/delete/${recordId}`)
            .then((response) => {
                alert(recordId);
                if (response.status === 200) {
                    // Remove the deleted file from the list
                    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file._id !== recordId));
                }
            })
            .catch((error) => {
                alert(recordId);
                console.error(error);
            });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            <ul>
                {Array.isArray(uploadedFiles) && uploadedFiles.length > 0 ? (
                    <ul>
                        {uploadedFiles.map((file) => (
                            <li key={file._id}>
                                <a href={`http://localhost:3001/${file.filePath}`}
                                    onClick={() => alert(`file://C:/Users/aminn/OneDrive/Desktop/clinic-main/clinic-main/server/uploads/${file.filePath}`)} download>${file.fileName}</a>
                                <button onClick={() => handleDelete(file._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No medical records found.</p>
                )}

            </ul>

        </div>
    );
}

export default MedicalHistory;