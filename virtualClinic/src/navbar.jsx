/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBBtn } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBell } from 'react-icons/fa'; // Import the bell icon
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();
    const [walletValue, setWalletValue] = useState(0);
    const [userType, setUserType] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userType = decodedToken.type.toLowerCase();
            setUserType(userType);

            if (token && userType !== 'admin') {
                axios
                    .get('http://localhost:3001/get-wallet-value', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        setWalletValue(response.data.walletValue.toFixed(2));
                    })
                    .catch((error) => {
                        console.error('Error fetching wallet value:', error);
                    });
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
    }, [navigate]);

    const handleLogout = () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            axios
                .post(
                    'http://localhost:3001/logout',
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const showMultipleNotifications = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch the most recent notifications for the user
            const response = await axios.get(`http://localhost:3001/get-notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const notifications = response.data;

            if (notifications.length === 0) {
                toast.info('No new notifications', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }

            // Display the notifications in a single box
            toast.info(
                <div>
                    {notifications.map((notification, index) => (
                        <div key={index} style={{ fontSize: '14px' }}>
                            {notification.message}
                            {index !== notifications.length - 1 && (
                                <hr style={{ margin: '5px 0', borderColor: 'gray' }} />
                            )}
                        </div>
                    ))}
                </div>,
                {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                    onClose: () => setShowNotifications(false),
                }
            );

            setShowNotifications(true);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const buttonStyles = {
        backgroundColor: 'lightred',
        border: '1px solid black',
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '10px',
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-light"
            style={{
                backgroundColor: '#f2f2f2',
                height: '70px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        alt="Logo"
                        className="navbar-icon"
                        style={{
                            width: '80px',
                            height: '70px',
                            borderRadius: '50%',
                        }}
                    />
                </div>
                <ul className="navbar-nav">
                    {userType !== 'admin' && (
                        <li className="nav-item">
                            <div>Wallet: ${walletValue}</div>
                        </li>
                    )}
                    <li className="nav-item">
                        <FaBell
                            size={30}
                            style={{ cursor: 'pointer' }}
                            onClick={showMultipleNotifications}
                        />
                    </li>
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
            <ToastContainer position="top-right" />
        </nav>
    );
};

export default Navbar;
*/
import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

import { IconContext } from 'react-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineBell, AiOutlineLogout } from 'react-icons/ai';
import SubMenu from './Submenu';
import styled from 'styled-components';
import { jwtDecode } from 'jwt-decode';


const SidebarWrap = styled.div`
  width: 100%;
`;

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const [walletValue, setWalletValue] = useState(0);
    const [userType, setUserType] = useState('');
    const [sidebarExpand, setSidebarExpand] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userType = decodedToken.type.toLowerCase();
            setUserType(userType);

            if (token && userType !== 'admin') {
                axios
                    .get('http://localhost:3001/get-wallet-value', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((response) => {
                        setWalletValue(response.data.walletValue.toFixed(2));
                    })
                    .catch((error) => {
                        console.error('Error fetching wallet value:', error);
                    });
            }
        } catch (error) {
            console.error('Error in useEffect:', error);
        }
    }, [navigate]);
    const goBack = () => {
        navigate(-1); // Navigate back to the last visited page
    };
    const buttonStyles = {
        backgroundColor: 'lightred',
        border: '1px solid black',
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '10px',
    };
    const showSidebar = () => setSidebar(!sidebar);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (navItem) => {
        setSelectedItem(selectedItem === navItem ? null : navItem);
    };
    const handleLogout = () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            axios
                .post(
                    'http://localhost:3001/logout',
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    const showMultipleNotifications = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            // Fetch the most recent notifications for the user
            const response = await axios.get(`http://localhost:3001/get-notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const notifications = response.data;

            if (notifications.length === 0) {
                toast.info('No new notifications', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return;
            }

            // Display the notifications in a single box
            toast.info(
                <div>
                    {notifications.map((notification, index) => (
                        <div key={index} style={{ fontSize: '14px' }}>
                            {notification.message}
                            {index !== notifications.length - 1 && (
                                <hr style={{ margin: '5px 0', borderColor: 'gray' }} />
                            )}
                        </div>
                    ))}
                </div>,
                {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true
                }
            );
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav style={{ backgroundColor: '#060b26', display: 'flex', justifyContent: 'space-between', height: '70px' }}>
                    <NavIcon to='#'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </NavIcon>
                    <div className="nav-items" style={{ display: 'flex', alignItems: 'center', paddingRight: '40px' }}>
                        <div className="nav-item">
                            <FaIcons.FaArrowLeft
                                size={30}
                                style={{ color: 'white', cursor: 'pointer', marginLeft: '20px', marginRight: '20px' }}
                                onClick={goBack}
                            />
                        </div>
                        {(userType === 'patient') && (
                        <div className="nav-item">
                            <Link to="/patient">
                                <AiOutlineHome
                                    size={30}
                                    style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}
                                />
                            </Link>
                        </div>
                        )}
                        {(userType === 'doctor') && (
                        <div className="nav-item">
                            <Link to="/doctor">
                                <AiOutlineHome
                                    size={30}
                                    style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}
                                />
                            </Link>
                        </div>
                        )}
                        {(userType === 'admin') && (
                        <div className="nav-item">
                            <Link to="/admin">
                                <AiOutlineHome
                                    size={30}
                                    style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}
                                />
                            </Link>
                        </div>
                        )}
                        {(userType === 'patient' || userType === 'doctor') && (
                            <div className="nav-item">
                                <AiOutlineBell
                                    size={30}
                                    style={{ color: 'white', cursor: 'pointer', marginRight: '20px' }}
                                    onClick={showMultipleNotifications}
                                />
                            </div>
                        )}
                        <div className="nav-item">
                            <AiOutlineLogout
                                size={30}
                                style={{ cursor: 'pointer' }}
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                </Nav>
                <SidebarNav sidebar={sidebar} style={{ backgroundColor: '#060b26' }}>
                    <SidebarWrap>
                        <NavIcon to='#'>
                            <AiIcons.AiOutlineClose onClick={showSidebar} />
                        </NavIcon>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} />;

                        })}
                        {(userType === 'patient' || userType === 'doctor') && (
                            <div className="wallet-value" style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', color: 'white', marginTop: '10px' }}>
                                <FaIcons.FaWallet className="wallet-icon" style={{ fontSize: '1.1em', marginRight: '15px' }} />
                                <div style={{ marginTop: '-2px' }}>${walletValue}</div>
                            </div>
                        )}

                    </SidebarWrap>
                </SidebarNav>
                <ToastContainer position="top-right" />

            </IconContext.Provider>
        </>
    );
}

export default Navbar;