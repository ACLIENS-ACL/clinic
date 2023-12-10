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

            if (userType !== 'doctor') {
                // If the user is not a patient or is not logged in, navigate to the login page
                navigate('/login');
            }
        } catch (error) {

        }
    }, [navigate]);

    const handleRejectRequest = (appointmentId) => {
        // Make an Axios POST request to reject the appointment
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
                window.location.reload();
                // Handle success, maybe update the UI accordingly
                console.log('Appointment rejected successfully:', response.data);
            })
            .catch(err => {
                // Handle error
                console.error('Error rejecting appointment:', err);
            });
    };

    const handleAcceptRequest = (appointmentId) => {
        // Make an Axios POST request to accept the appointment
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
                window.location.reload();
                // Handle success, maybe update the UI accordingly
                console.log('Appointment accepted successfully:', response.data);
            })
            .catch(err => {
                // Handle error
                console.error('Error accepting appointment:', err);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Make an Axios GET request to fetch the patient's appointments with doctor names and statuses
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
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && (
                <ul>
                    {requests.map(request => (
                        <li key={request.appointmentId}>
                            {/* Display request details here */}
                            <p>Patient Name: {request.patientName}</p>
                            <p>Date: {request.appointmentDate}</p>
                            {/* Buttons to accept and reject */}
                            <button onClick={() => handleAcceptRequest(request.appointmentId)}>
                                Accept
                            </button>
                            <button onClick={() => handleRejectRequest(request.appointmentId)}>
                                Reject
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}



export default FollowUpRequests;
