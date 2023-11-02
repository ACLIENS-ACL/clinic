import React from 'react';
import axios from 'axios';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

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
        fontWeight: 'bold'
    };
   

    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#f2f2f2', height: '70px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="container d-flex justify-content-between align-items-center">
                <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                    alt="Logo"
                    className="navbar-icon"
                    style={{ width: '80px', height: '70px', borderRadius: '50%' }}
                />
                <ul className="navbar-nav">
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
