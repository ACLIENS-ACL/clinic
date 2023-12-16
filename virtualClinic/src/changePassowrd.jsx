import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
};

function ChangePassword() {
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch admin data from the server
        axios.get(`http://localhost:3001/get-user-type`).then((response) => {
            const responseData = response.data;
            if (responseData.in !== true) {
                navigate('/login');
                return null;
            }
        });
    }, []);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (!validatePassword(newPassword)) {
            setMessage('Password does not meet the required criteria.');
            return;
        }

        try {
            // Make an API call to change the password
            const response = await axios.post('http://localhost:3001/change-password', {
                currentPassword,
                newPassword
            });

            if (response.status === 200) {
                setMessage('Password changed successfully');
            } else {
                setMessage('Failed to change password');
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response.data.message || 'An error occurred while changing the password');
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <div>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Change Password</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default ChangePassword;
