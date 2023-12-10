// PatientDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaComment, FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatientDropdown = () => {
    const [patients, setPatients] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/myPatients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleChatClick = async (e, patientId) => {
        e.stopPropagation(); // Prevent the event from propagating to the parent elements
        const token = localStorage.getItem('token');

        // Check if a room already exists with the current patient and clicked doctor
        const response = await axios.post(`http://localhost:3001/createRoomDoctor`, { patientId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate(`/chat/${response.data.roomId}`);
    }

    const handleVideoCallClick = async (e, patientId) => {
        e.stopPropagation(); // Prevent the event from propagating to the parent elements
        const token = localStorage.getItem('token');

        // Check if a room already exists with the current patient and clicked doctor
        const response = await axios.post(`http://localhost:3001/createVideoRoomDoctor`, { patientId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate(`/video/${response.data.roomId}`);
    };

    return (
        <div className={`app ${sidebarVisible ? '' : 'collapsed'}`}>
            <div className="toggle-arrow" onClick={toggleSidebar}>
                {sidebarVisible ? '▲' : '▼'}
            </div>
            {sidebarVisible && (
                <div className="contact-list">
                    {patients.map((patient) => (
                        <div key={patient.patientId} className="contact-item">
                            <span>{patient.patientName}</span>
                            <span className="icons">
                                <FaComment
                                    style={{ marginRight: '5px', cursor: 'pointer' }}
                                    onClick={(e) => handleChatClick(e, patient.patientId)}
                                />
                                <FaVideo
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => handleVideoCallClick(e, patient.patientId)}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDropdown;
