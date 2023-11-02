import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const [packages, setPackages] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showDropdowns, setShowDropdowns] = useState({});
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
        // Make an Axios call to your backend API to fetch the packages.
        axios.get('http://localhost:3001/packages')
            .then((response) => {
                setPackages(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        // Make an Axios call to your backend API to fetch the family members.
        axios.get('http://localhost:3001/view-family-members')
            .then((response) => {
                setFamilyMembers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const listItemStyle = {
        border: '1px solid #ccc',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#f4f4f4',
    };

    const headingStyle = {
        fontSize: '32px',
        textAlign: 'center',
    };

    const subscribeButtonStyle = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
    };

    const dropdownStyle = {
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 1,
        padding: '10px',
        width: '90vw',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    const dropdownItemStyle = {
        padding: '5px',
        borderBottom: '1px solid #ddd',
    };

    const closeDropdownStyle = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        cursor: 'pointer',
    };

    const familyMemberSelectStyle = {
        width: '100%',
        height: '150px',
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

    const handleSubscribeClickToServer = (packageId, self) => {
        const selectedFamilyMembers = selectedOptions[packageId]?.familyMembers || [];
        const data = {
            self: (self) ? true : false,
            packageId,
            familyMembers: selectedFamilyMembers,
        };

        // Make an HTTP POST request to the server
        axios.post('http://localhost:3001/subscribe', data)
            .then((response) => {
                // Handle the server response, e.g., redirect to a success page
            })
            .catch((error) => {
                // Handle the error, e.g., show an error message
                console.error(error);
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
            totalCost += numberOfFamilyMembers * (baseCost);
        }

        return totalCost.toFixed(2); // Round to 2 decimal places
    };
    return (
        <div>
            <h2 style={headingStyle}>List of Available Packages</h2>
            <ul>
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
                                    style={closeDropdownStyle}
                                    onClick={() => handleCloseDropdown(availPackage._id)}
                                >
                                    X
                                </button>
                                <p><strong>Total Cost:</strong> ${calculateTotalCost(availPackage)}</p>
                                <label>
                                    <input
                                        type="checkbox"
                                        value="self"
                                        checked={selectedOptions[availPackage._id]?.self || false}
                                        onChange={(e) => handleOptionChange(availPackage._id, e)}
                                    />
                                    Self
                                </label>
                                <br />
                                <label>
                                    <input
                                        type="checkbox"
                                        value="family"
                                        checked={selectedOptions[availPackage._id]?.family || false}
                                        onChange={(e) => handleOptionChange(availPackage._id, e)}
                                    />
                                    Family Members
                                </label>
                                <br />
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
                                <br />
                                <input type="radio" id="wallet" name="payment" value="wallet" />
                                <label htmlFor="wallet">Pay with Wallet</label>
                                <br />
                                <input type="radio" id="creditCard" name="payment" value="creditCard" />
                                <label htmlFor="creditCard">Pay with Credit Card</label>
                                <br />
                                <button onClick={handleSubscribeClickToServer(availPackage._id, selectedOptions[availPackage._id]?.self)}>Subscribe</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
