import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

function AdminDashboard() {
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
    const [userData, setUserData] = useState(null);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
    const [selectedFamilyMemberDate, setSelectedFamilyMemberDate] = useState(null);
    const [selectedFamilyMemberCanceled, setSelectedFamilyMemberCanceled] = useState(null);
    const [selectedFamilyMemberPackage, setSelectedFamilyMemberPackage] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyMemberPackage, setFamilyMemberPackage] = useState(null);


    useEffect(() => {
        // Fetch admin data from the server
        axios.get(`http://localhost:3001/get-my-package`).then((response) => {
            setUserData(response.data);
        }
        );

        // Fetch family members
        axios.get('http://localhost:3001/view-family-members').then((response) => {
            setFamilyMembers(response.data);
        });
    });


    const handleCancelSubscription = () => {
        axios.post('http://localhost:3001/cancel-subscription')
    }
    const handleFamilyCancelSubscription = async () => {
        await axios.post(`http://localhost:3001/cancel-family-subscription/${selectedFamilyMember}`);
        fetchFamilyMemberSubscription(selectedFamilyMember);
    }
    const handleFamilyMemberSelect = (selectedOption) => {
        if (selectedOption) {
            // Parse the JSON string back into an object
            const selectedMember = JSON.parse(selectedOption);
            // Access the subscribedPackage property and set it to familyMember
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
        try {
            const response = await axios.get(`http://localhost:3001/get-family-member-package-status/${familyMemberId}`);
            setSelectedFamilyMemberCanceled(response.data.canceled);
            setSelectedFamilyMemberDate(response.data.subscriptionDate)
        } catch (error) {
            // Handle errors
        }
    };
    useEffect(() => {
        if (selectedFamilyMemberPackage) {
            fetchFamilyMemberPackage(selectedFamilyMemberPackage);
            fetchFamilyMemberSubscription(selectedFamilyMember);
        }
    }, [selectedFamilyMemberPackage]);
    return (
        <div>
            <Navbar />
            <div>
                <h2>Subscribed Package and Details</h2>
                {userData && userData.package && (
                    <div>
                        <h3>Subscribed Package:</h3>
                        <ul>
                            {Object.entries(userData.package).filter(([key]) => key !== '_id' && key !== '__v').map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {userData && userData.canceled && (
                    <div>
                        <h3>Status: Canceled</h3>
                        <p>Cancelation Date: {userData.canceled}</p>
                    </div>
                )}

                {userData && !userData.canceled && (
                    <div>
                        {getSubscriptionStatus(userData.subscribedDate)}
                        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
                    </div>
                )}
            </div>
            <div>
                <h2>Select Family Member</h2>

                <select onChange={(e) => handleFamilyMemberSelect(e.target.value)}>
                    <option value="">Select a Family Member</option>
                    {familyMembers.map((member, index) => (
                        <option key={index} value={JSON.stringify(member)} >
                            {member.name}
                        </option>
                    ))}
                </select>

                {selectedFamilyMemberPackage && (
                    <div>
                        {familyMemberPackage && (
                            <div>
                                <ul>
                                    {Object.entries(familyMemberPackage).filter(([key]) => key !== '_id' && key !== '__v').map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {selectedFamilyMemberCanceled && (
                            <div>
                                <h3>Status: Canceled</h3>
                                <p>Cancelation Date: {selectedFamilyMemberCanceled}</p>
                            </div>
                        )}
                        {!selectedFamilyMemberCanceled && (
                            <div>
                                {getSubscriptionStatus(selectedFamilyMemberDate)}
                                <button onClick={handleFamilyCancelSubscription}>Cancel Subscription</button>
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
