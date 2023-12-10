import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";
function AdminDashboard() {
    const [packages, setPackages] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showDropdowns, setShowDropdowns] = useState({});
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();
    const [error, setError] = useState('');

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
        axios.get('http://localhost:3001/packages')
            .then((response) => {
                setPackages(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios call to your backend API to fetch the family members.
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
        }
    }, []);


    useEffect(() => {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Check if the token exists before making the request
        if (token) {
            // Make an Axios call to your backend API to fetch the family members.
            axios.get('http://localhost:3001/get-family-discount', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setDiscount(response.data.familyMemberDiscount);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);

    const [isHovered, setIsHovered] = useState(false);
    const headingStyle = {
        fontSize: '24px',
        color: '#333',
        margin: '20px',
        textAlign:'center'
    };

    const listItemStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
    };

    const subscribeButtonStyle = {
        backgroundColor: 'navy',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
    };

    const dropdownStyle = {
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '10px',
    };

    const closeDropdownStyle = {
        color: 'black',
        padding: '0px 10px',
        cursor: 'pointer',
        border: 'none',
        background: 'transparent', // Set the background to transparent
        float: 'right',
        transition: 'color 0.3s', // Change transition to color for text color change
        fontSize: '1.0em',
    };

    const checkboxLabelStyle = {
        display: 'block',
        margin: '10px 4px',
        fontFamily: 'Arial, sans-serif', // Adjust font family as needed
        fontSize: '16px', // Adjust font size as needed
    };

    const checkboxStyle = {
        marginRight: '10px', // Adjust margin as needed
    };

    const familyMemberSelectStyle = {
        width: '100%',
        padding: '8px',
        boxSizing: 'border-box',
        marginBottom: '10px',
    };
    const errorContainerStyle = {
        backgroundColor: 'transparent', // Red background color
        color: 'red',
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
    };

    const errorTextStyle = {
        margin: '0',
        fontSize: '16px',
    };
    const payButtonStyle = {
        backgroundColor: 'navy',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '16px', // Adjust font size as needed
        marginTop: '10px', // Adjust margin as needed
    };

    const dropdownItemStyle = {
        padding: '8px',
    };

    const handleSubscribeClick = (packageId) => {
        // Close all other dropdowns
        const newShowDropdowns = { ...showDropdowns };
        Object.keys(newShowDropdowns).forEach((key) => {
            newShowDropdowns[key] = false;
        });
        newShowDropdowns[packageId] = true;
        setShowDropdowns(newShowDropdowns);

        // Reset selected options for this package
        setSelectedOptions({
            ...selectedOptions,
            [packageId]: {},
        });
    };

    const handleOptionChange = (packageId, event) => {
        const option = event.target.value;
        setSelectedOptions({
            ...selectedOptions,
            [packageId]: {
                ...selectedOptions[packageId],
                [option]: !selectedOptions[packageId][option],
            },
        });
    };

    const handleCloseDropdown = (packageId) => {
        setShowDropdowns({
            ...showDropdowns,
            [packageId]: false,
        });
        setSelectedOptions({
            ...selectedOptions,
            [packageId]: {},
        });
    };
    const handleFamilyMembersChange = (packageId, event) => {
        const selectedFamilyMembers = Array.from(event.target.options)
            .filter((option) => option.selected)
            .map((option) => option.value);

        setSelectedOptions({
            ...selectedOptions,
            [packageId]: {
                ...selectedOptions[packageId],
                family: true, // Set family to true
                familyMembers: selectedFamilyMembers,
            },
        });
    };

    const calculateTotalCost = (availPackage) => {
        const baseCost = availPackage.cost;
        let totalCost = 0;

        if (selectedOptions[availPackage._id]?.self) {
            totalCost += baseCost;
        }

        if (selectedOptions[availPackage._id]?.self && selectedOptions[availPackage._id]?.family) {
            const familyDiscount = availPackage.familyMemberDiscount / 100;
            const numberOfFamilyMembers = (selectedOptions[availPackage._id]?.familyMembers || []).length;
            totalCost += numberOfFamilyMembers * (baseCost - baseCost * familyDiscount);
        }
        else if (selectedOptions[availPackage._id]?.family) {
            const numberOfFamilyMembers = (selectedOptions[availPackage._id]?.familyMembers || []).length;
            totalCost += numberOfFamilyMembers * (baseCost) * (1 - discount);
        }

        return totalCost.toFixed(2); // Round to 2 decimal places
    };
    const NavigateToPay = (totalPaymentDue, type, packageId, self) => {
        if (totalPaymentDue == 0) {
            setError("Please choose at least one person to subscribe!");
        }
        else {
            if (!self) {
                self = false;
            }
            const selectedFamilyMembers = selectedOptions[packageId]?.familyMembers || [];
            const familyMembersString = selectedFamilyMembers.join(',') || "none";
            const navigationPath = `/pay/${totalPaymentDue}/${type}/${packageId}/${self}/${familyMembersString}`;
            navigate(navigationPath);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{width:'70%', margin:'auto'}}>
                <h2 style={headingStyle}>List of Available Packages</h2>
                <ul style={{ listStyleType: 'none' }}>
                    {packages.map((availPackage) => (
                        <li key={availPackage._id} style={listItemStyle}>
                            <h3>{availPackage.package}</h3>
                            <p><strong>Cost:</strong> ${availPackage.cost}</p>
                            <p><strong>Doctor Session Discount:</strong> {availPackage.doctorSessionDiscount}%</p>
                            <p><strong>Medicines Discount:</strong> {availPackage.medicinesDiscount}%</p>
                            <p><strong>Family Member Discount:</strong> {availPackage.familyMemberDiscount}%</p>
                            <button
                                style={subscribeButtonStyle}
                                onClick={() => handleSubscribeClick(availPackage._id)}
                            >
                                Subscribe
                            </button>
                            {showDropdowns[availPackage._id] && (
                                <div style={dropdownStyle}>
                                    <button
                                        style={{ ...closeDropdownStyle, color: isHovered ? '#C70039 ' : '#ccc' }}
                                        onMouseOver={() => setIsHovered(true)}
                                        onMouseOut={() => setIsHovered(false)}
                                        onClick={() => handleCloseDropdown(availPackage._id)}
                                    >
                                        <strong>X</strong>
                                    </button>
                                    <p><strong>Total Cost:</strong> ${calculateTotalCost(availPackage)}</p>
                                    <label style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            value="self"
                                            checked={selectedOptions[availPackage._id]?.self || false}
                                            onChange={(e) => handleOptionChange(availPackage._id, e)}
                                            style={checkboxStyle}
                                        />
                                        Self
                                    </label>
                                    <label style={checkboxLabelStyle}>
                                        <input
                                            type="checkbox"
                                            value="family"
                                            checked={selectedOptions[availPackage._id]?.family || false}
                                            onChange={(e) => handleOptionChange(availPackage._id, e)}
                                            style={checkboxStyle}
                                        />
                                        Family Members
                                    </label>
                                    {selectedOptions[availPackage._id]?.family && (
                                        <select multiple style={familyMemberSelectStyle} onChange={(e) => handleFamilyMembersChange(availPackage._id, e)}>
                                            {familyMembers.map((familyMember) => (
                                                <option
                                                    key={familyMember.id}
                                                    value={familyMember.name}
                                                    style={dropdownItemStyle}
                                                >
                                                    {familyMember.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {error && (
                                        <div style={errorContainerStyle}>
                                            <p style={errorTextStyle}>{error}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => NavigateToPay(
                                            calculateTotalCost(availPackage),
                                            "packagePayment",
                                            availPackage._id,
                                            selectedOptions[availPackage._id]?.self
                                        )}
                                        style={payButtonStyle}
                                    >
                                        Pay & Subscribe
                                    </button>                            </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
