import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [walletValue, setWalletValue] = useState(0);
    const [userType, setUserType] = useState('');

    useEffect(() => {
        // Fetch user type and wallet value from the server
        axios.get(`http://localhost:3001/get-user-type`)
            .then((response) => {
                setUserType(response.data.type);
            })
            .catch((error) => {
                console.error('Error fetching user type and wallet value:', error);
            });
    }, []);
    useEffect(() => {
        // Fetch wallet value from the server
        axios.get(`http://localhost:3001/get-wallet-value`)
            .then((response) => {
                setWalletValue(response.data.walletValue);
            })
            .catch((error) => {
                console.error('Error fetching wallet value:', error);
            });
    }, []);

    const handleLogout = () => {
        axios.post(`http://localhost:3001/logout`)
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Logout failed:', error);
            });
    };

    const buttonStyles = {
        backgroundColor: 'lightred',
        border: '1px solid black',
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '10px'
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#f2f2f2', height: '70px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        alt="Logo"
                        className="navbar-icon"
                        style={{ width: '80px', height: '70px', borderRadius: '50%' }}
                    />

                </div>
                <ul className="navbar-nav">
                    {userType !== 'admin' && (
                        <li className="nav-item">
                            <div>
                                Wallet: ${walletValue}
                            </div>
                        </li>
                    )}
                    <li className="nav-item">
                        <MDBBtn
                            color="danger"
                            onClick={handleLogout}
                            style={buttonStyles}
                        >
                            Logout
                        </MDBBtn>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
