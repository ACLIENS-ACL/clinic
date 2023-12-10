import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

function AdminDashboard() {
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
    const [userData, setUserData] = useState(null);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
    const [selectedFamilyMemberDate, setSelectedFamilyMemberDate] = useState(null);
    const [selectedFamilyMemberCanceled, setSelectedFamilyMemberCanceled] = useState(null);
    const [selectedFamilyMemberPackage, setSelectedFamilyMemberPackage] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyMemberPackage, setFamilyMemberPackage] = useState(null);
    const containerStyle = {
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    };

    const sectionContainerStyle = {
        marginBottom: '20px',
        width:'60%',
        margin:'auto'
    };

    const sectionHeadingStyle = {
        fontSize: '24px',
        color: '#333',
        marginBottom: '15px',
        textAlign:'center'
    };

    const subsectionStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
    };

    const selectStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        marginBottom: '20px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    };

    const cancelButtonStyle = {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
        marginLeft: '10px',
    };


    useEffect(() => {
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios GET request to fetch user's package information
            axios.get('http://localhost:3001/get-my-package', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });

            // Fetch family members
            axios.get('http://localhost:3001/view-family-members', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setFamilyMembers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error('User not authenticated');
        }

    });

    const handleCancelSubscription = () => {
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios POST request to cancel the subscription
            axios.post('http://localhost:3001/cancel-subscription', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log(response.data.message);
                    // Handle success or update the UI accordingly
                })
                .catch((error) => {
                    console.error(error);
                    // Handle errors or update the UI accordingly
                });
        } else {
            console.error('User not authenticated');
            // Handle not authenticated scenario or redirect to login
        }
    };

    const handleFamilyCancelSubscription = async () => {
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios POST request to cancel the family member's subscription
            await axios.post(`http://localhost:3001/cancel-family-subscription/${selectedFamilyMember}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Fetch updated family member subscription details
            fetchFamilyMemberSubscription(selectedFamilyMember);
        } else {
            console.error('User not authenticated');
            // Handle not authenticated scenario or redirect to login
        }
    };

    const handleFamilyMemberSelect = (selectedOption) => {
        if (selectedOption) {
            // Parse the JSON string back into an object
            const selectedMember = JSON.parse(selectedOption);
            setSelectedFamilyMemberPackage(selectedMember.subscribedPackage);
            setSelectedFamilyMemberCanceled(selectedMember.canceled)
            setSelectedFamilyMember(selectedMember._id);
        } else {
            // Handle the case when no family member is selected
            setSelectedFamilyMemberPackage(null);
            setSelectedFamilyMember(null);
        }
    };

    const fetchFamilyMemberPackage = async (familyMemberPackageId) => {
        try {
            const response = await axios.get(`http://localhost:3001/get-family-member-package/${familyMemberPackageId}`);
            setFamilyMemberPackage(response.data);
        } catch (error) {
            // Handle errors
        }
    };
    const fetchFamilyMemberSubscription = async (familyMemberId) => {
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            try {
                // Make an Axios GET request to fetch the family member's package status
                const response = await axios.get(`http://localhost:3001/get-family-member-package-status/${familyMemberId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSelectedFamilyMemberCanceled(new Date((response.data.canceled)).toDateString());
                setSelectedFamilyMemberDate(response.data.subscriptionDate);
            } catch (error) {
                // Handle errors
                console.error(error);
            }
        } else {
            console.error('User not authenticated');
            // Handle not authenticated scenario or redirect to login
        }
    };
    const formatKey = (key) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    };

    // Function to format the value, appending a percentage symbol for specific keys
    const formatValue = (key, value) => {
        return key.includes('Discount') ? `${value}%` : value;
    };
    useEffect(() => {
        if (selectedFamilyMemberPackage) {
            fetchFamilyMemberPackage(selectedFamilyMemberPackage);
            fetchFamilyMemberSubscription(selectedFamilyMember);
        }
    }, [selectedFamilyMemberPackage]);
    return (
        <div style={containerStyle}>
            <Navbar />
            <div style={sectionContainerStyle}>
                <br></br>
                <h2 style={sectionHeadingStyle}>Subscribed Package and Details</h2>
                {userData && userData.package && (
                    <div style={subsectionStyle}>
                        <h3>Subscribed Package:</h3>
                        <ul style={{ listStyleType: 'none' }}>
                            {Object.entries(userData.package)
                                .filter(([key]) => key !== '_id' && key !== '__v')
                                .map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{formatKey(key)}:</strong> {formatValue(key, value)}
                                    </li>
                                ))}
                        </ul>

                        {userData && userData.canceled && (
                            <div style={subsectionStyle}>
                                <h3>Status: Canceled</h3>
                                <p><strong>Cancelation Date:</strong> {(new Date(userData.canceled)).toDateString()}</p>
                            </div>
                        )}

                        {userData && !userData.canceled && (
                            <div style={subsectionStyle}>
                                {getSubscriptionStatus(userData.subscribedDate)}
                                <button style={cancelButtonStyle} onClick={handleCancelSubscription}>
                                    Cancel Subscription
                                </button>
                            </div>
                        )}

                    </div>
                )}



            </div>

            <div style={sectionContainerStyle}>
                <h2 style={sectionHeadingStyle}>Select Family Member</h2>

                <select style={selectStyle} onChange={(e) => handleFamilyMemberSelect(e.target.value)}>
                    <option value="">Select a Family Member</option>
                    {familyMembers.map((member, index) => (
                        <option key={index} value={JSON.stringify(member)}>
                            {member.name}
                        </option>
                    ))}
                </select>

                {selectedFamilyMemberPackage && (
                    <div style={subsectionStyle}>
                        {familyMemberPackage && (
                            <div>
                                <ul style={{ listStyleType: 'none' }}>
                                    {Object.entries(familyMemberPackage)
                                        .filter(([key]) => key !== '_id' && key !== '__v')
                                        .map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{formatKey(key)}:</strong> {formatValue(key, value)}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                        {selectedFamilyMemberCanceled && (
                            <div style={subsectionStyle}>
                                <h3>Status: Canceled</h3>
                                <p><strong>Cancelation Date: </strong>{selectedFamilyMemberCanceled}</p>
                            </div>
                        )}
                        {!selectedFamilyMemberCanceled && (
                            <div style={subsectionStyle}>
                                {getSubscriptionStatus(selectedFamilyMemberDate)}
                                <button style={cancelButtonStyle} onClick={handleFamilyCancelSubscription}>
                                    Cancel Subscription
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}

function getSubscriptionStatus(subscriptionDate) {
    const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
    const currentDate = new Date();
    const renewalDate = new Date(subscriptionDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Calculate the renewal date

    if (currentDate < renewalDate) {
        return (
            <div>
                <h3>Status: Subscribed</h3>
                <p>Renewal Date: {renewalDate.toDateString()}</p>
            </div>
        );
    } else {
        return (
            <div>
                <h3>Status: Unsubscribed</h3>
            </div>
        );
    }
}

export default AdminDashboard;
