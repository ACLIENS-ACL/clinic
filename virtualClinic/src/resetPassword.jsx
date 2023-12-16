import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOTPSent] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);

  const sendOTP = async () => {
    try {
      // Make an API call to send an OTP to the user's email
      const response = await axios.post('http://localhost:3001/send-otp', {
        username,
      });

      if (response.status === 200) {
        setMessage('OTP sent to your email.');
        setOTPSent(true);
      } else {
        setMessage('Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message || 'An error occurred while sending OTP.');
    }
  };

  const verifyOTP = async () => {
    try {
      // Make an API call to verify the OTP
      const response = await axios.post('http://localhost:3001/verify-otp', {
        username,
        otp,
      });

      if (response.status === 200) {
        setMessage('OTP verified successfully. You can now set a new password.');
        setOTPVerified(true);
      } else {
        setMessage('OTP verification failed.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message || 'An error occurred while verifying OTP.');
    }
  };

  const resetPassword = async () => {
    if (!otpVerified) {
      setMessage('Please verify the OTP first.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('Password does not meet the required criteria.');
      return;
    }

    try {
      // Make an API call to reset the password
      const response = await axios.post('http://localhost:3001/reset-password', {
        username,
        newPassword,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully');
      } else {
        setMessage('Failed to reset the password.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message || 'An error occurred while resetting the password.');
    }
  };

  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {!otpVerified && !otpSent ? (
        <button onClick={sendOTP}>Send OTP</button>
      ) : (
        <div>
          <div>
            <label>Enter OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
            <button onClick={verifyOTP}>Verify OTP</button>
          </div>
          {otpVerified && (
            <div>
              <div>
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <button onClick={resetPassword}>Reset Password</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
