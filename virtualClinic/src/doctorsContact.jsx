// DoctorDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaComment, FaVideo } from 'react-icons/fa'; // Import chat and video call icons
import { useNavigate } from 'react-router-dom';

const App = () => {
    const [doctors, setDoctors] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/myDoctors', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const handleChatClick = async (e, doctorId) => {
        e.stopPropagation(); // Prevent the event from propagating to the parent elements
        const token = localStorage.getItem('token');

        // Check if a room already exists with the current patient and clicked doctor
        const response = await axios.post(`http://localhost:3001/createRoom`, { doctorId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate(`/chat/${response.data.roomId}`);

    }
    const handleVideoCallClick = async (e, doctorId) => {
        e.stopPropagation(); // Prevent the event from propagating to the parent elements
        const token = localStorage.getItem('token');

        // Check if a room already exists with the current patient and clicked doctor
        const response = await axios.post(`http://localhost:3001/createVideoRoom`, { doctorId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        navigate(`/video/${response.data.roomId}`);

    }
    return (
        <div className={`app ${sidebarVisible ? '' : 'collapsed'}`}>
            <div className="toggle-arrow" onClick={toggleSidebar}>
                {sidebarVisible ? '▲' : '▼'}
            </div>
            {sidebarVisible && (
                <div className="contact-list">
                    {doctors.map((doctor) => (
                        <div>
                            <span>{doctor.doctorName}</span>
                            <span style={{ marginLeft: '10px' }}>
                                {/* Add chat and video icons */}
                                <FaComment
                                    style={{ marginRight: '5px', cursor: 'pointer' }}
                                    onClick={(e) => handleChatClick(e, doctor.doctorId)}
                                />
                                <FaVideo
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => handleVideoCallClick(e, doctor.doctorId)}
                                />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;

// Internal CSS
const styles = `
  .app {
    padding: 20px;
    position: relative;
  }

  .toggle-arrow {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  .contact-list {
    width: 100%; /* Ensure the contact list takes up the full width */
    max-width: 200px; /* Set a maximum width if needed */
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    position: absolute;
    top: 40px; /* Adjust the top position to leave space for the arrow */
    right: 10px; /* Adjust the right position to align with the arrow */
  }

  .contact-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .icons {
    display: flex;
    gap: 10px;
  }

  .app.collapsed .contact-list {
    display: none;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);