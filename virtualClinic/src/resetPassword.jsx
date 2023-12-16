import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOTPSent] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [isResetClicked, setIsResetClicked] = useState(false);
  const sendOTP = async () => {
    try {

      // Make an API call to send an OTP to the user's email
      const response = await axios.post('http://localhost:3001/send-otp', {
        username,
      });

      if (response.status === 200) {
        setIsResetClicked(true);
        setMessage(null);
        setOTPSent(true);
      } else {
        setMessage('Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message || 'An error occurred while sending OTP.');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  const verifyOTP = async () => {
    try {
      // Make an API call to verify the OTP
      const response = await axios.post('http://localhost:3001/verify-otp', {
        username,
        otp,
      });

      if (response.status === 200) {
        setMessage(null);
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="panel panel-default border rounded p-4">
            <div className="panel-body">
              <div className="text-center">
                <h3>
                  <i className="fa fa-lock fa-4x"></i>
                </h3>
                <h2 className="text-center">Forgot Password?</h2>
                <p>You can reset your password here.</p>
                <div className="panel-body">
                  <form
                    id="register-form"
                    role="form"
                    autoComplete="off"
                    className="form"
                    method="post"
                    onSubmit={handleSubmit}
                  >
                    {!isResetClicked ? (
                      <div>
                        <div className="form-group" style={{ width: '70%', margin: 'auto' }}>
                          <div className="input-group">
                            <input
                              id="username"
                              name="username"
                              placeholder="Username"
                              className="form-control"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              style={{ width: '70%' }}
                            />
                          </div>
                        </div>
                        {message && <p style={{ color: 'red' }}>{message}</p>}
                        <div className="form-group mt-3">
                          <button
                            type="submit"
                            className="btn btn-lg btn-primary btn-block"
                            onClick={() => { sendOTP() }}
                          >
                            Send OTP
                          </button>
                        </div>
                      </div>
                    ) : (
                      !otpVerified ? (
                        <div>
                          <div className="form-group" style={{ width: '70%', margin: 'auto' }}>
                            <p>Please provide OTP sent to your email.</p>
                            <div className="input-group">
                              <input
                                id="otp"
                                name="otp"
                                placeholder="OTP"
                                className="form-control"
                                type="text"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                                style={{ width: '70%' }}
                              />
                            </div>
                          </div>
                          {message && <p style={{ color: 'red' }}>{message}</p>}
                          <div className="form-group mt-3">
                            <button
                              type="submit"
                              className="btn btn-lg btn-primary btn-block"
                              onClick={() => { verifyOTP() }}
                            >
                              Verify OTP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="form-group">
                          <div className="form-group" style={{ width: '70%', margin: 'auto' }}>
                            <div className="input-group">
                              <input
                                id="password"
                                name="username"
                                placeholder="New Password"
                                className="form-control"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ width: '70%' }}
                              />
                            </div>
                            <br></br>
                            <div className="input-group">
                              <input
                                id="password"
                                name="username"
                                placeholder="Confirm new Password"
                                className="form-control"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                style={{ width: '70%' }}
                              />
                            </div>
                          </div>
                          {message && <p style={{ color: 'red' }}>{message}</p>}

                          <div className="form-group mt-3">
                            <button
                              type="submit"
                              className="btn btn-lg btn-primary btn-block"
                              onClick={resetPassword}
                            >
                              Reset Password
                            </button>
                          </div>

                        </div>
                      )
                    )}


                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/*return (
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
};*/

export default ResetPassword;
