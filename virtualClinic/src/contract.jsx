import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorContract() {
    const [accepted, setAccepted] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch admin data from the server
        axios.get(`http://localhost:3001/get-user-type`).then((response) => {
            const responseData = response.data;
            if (responseData.type !== 'doctor' || responseData.in !== true) {
                navigate('/login');
                return null;
            }
        });
    }, []);
    const handleAccept = () => {
        axios.post('http://localhost:3001/accept-contract')
            .then(() => {
                setAccepted(true);
                navigate('/patient');
            })
            .catch((error) => {
                console.error('Error accepting contract:', error);
            });
    };

    const handleReject = () => {
        axios.post('http://localhost:3001/reject-contract')
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Error rejecting contract:', error);
            });
    };

    const containerStyle = {
        backgroundColor: '#f5f5f5',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        maxWidth: '500px',
        margin: '0 auto',
    };

    const contentStyle = {
        marginTop: '20px',
        border: '1px solid #ddd',
        padding: '15px',
        backgroundColor: '#fff',
    };

    const buttonsStyle = {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    };

    const acceptButtonStyle = {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const rejectButtonStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>
            <h1>Doctor Contract</h1>
            <div style={contentStyle}>
                <p>
                    This contract outlines the terms and conditions for working with our clinic.
                    By accepting this contract, you agree to the following terms:
                </p>

                <h3>Terms and Conditions:</h3>
                <ul>
                    <li>The clinic imposes a 10% markup fee on patients' bills for a profit.</li>
                    <li>You will provide medical services to patients under the terms of this contract.</li>
                    <li>You will follow all relevant laws and regulations in your medical practice.</li>
                    {/* Add more terms as needed */}
                </ul>

                <p>Do you accept these terms and conditions?</p>

                <div style={buttonsStyle}>
                    <button onClick={handleAccept} disabled={accepted} style={acceptButtonStyle}>
                        Accept
                    </button>
                    <button onClick={handleReject} disabled={accepted} style={rejectButtonStyle}>
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoctorContract;
