import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function FollowUpRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userType = decodedToken.type.toLowerCase();

            if (userType !== 'doctor') {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            navigate('/login');
        }
    }, [navigate]);

    const handleRejectRequest = (appointmentId) => {
        const token = localStorage.getItem('token');
        axios.post(
            'http://localhost:3001/rejectRequest',
            { appointmentId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                // Update state instead of reloading the whole page
                setRequests(prevRequests => prevRequests.filter(request => request.appointmentId !== appointmentId));
            })
            .catch(err => {
                console.error('Error rejecting appointment:', err);
            });
    };

    const handleAcceptRequest = (appointmentId) => {
        const token = localStorage.getItem('token');
        axios.post(
            'http://localhost:3001/acceptRequest',
            { appointmentId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                // Update state instead of reloading the whole page
                setRequests(prevRequests => prevRequests.filter(request => request.appointmentId !== appointmentId));
            })
            .catch(err => {
                console.error('Error accepting appointment:', err);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3001/getRequests', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setRequests(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <Navbar />
            <br></br>
            <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', width: '45%', margin: 'auto' }}>
                
                <h3 style={{ fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>Follow-Up Requests</h3>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
                {!loading && !error && requests.length === 0 && (
                    <p>No follow-up requests at the moment.</p>
                )}
                {!loading && !error && requests.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {requests.map(request => (
                            <li key={request.appointmentId} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '15px' }}>
                                <p><strong>Patient Name:</strong> {request.patientName}</p>
                                <p><strong>Date:</strong> {request.appointmentDate}</p>
                                <button
                                    onClick={() => handleAcceptRequest(request.appointmentId)}
                                    style={{
                                        padding: '8px',
                                        marginRight: '10px',
                                        backgroundColor: '#ccc',
                                        color: '#fff',
                                        border: '1px solid #999',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        width:'70px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#030c37'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ccc'}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRejectRequest(request.appointmentId)}
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#ccc',
                                        color: '#fff',
                                        border: '1px solid #999',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s',
                                        width:'70px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'crimson'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ccc'}
                                >
                                    Reject
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );



}

export default FollowUpRequests;
