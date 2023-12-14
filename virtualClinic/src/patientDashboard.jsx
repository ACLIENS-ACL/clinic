import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import { IoPersonAddSharp } from "react-icons/io5";
import CSS from './assets/css/theme.css';
import Bg from './assets/img/gallery/hero-bg.png';
import Hero from "./assets/img/gallery/hero.png"
import { FaComment, FaVideo } from 'react-icons/fa'; // Import chat and video call icons

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import doctorList from './doctorsContact';
import { Dropdown } from 'react-bootstrap';
import DoctorsBg from './assets/img/gallery/doctors-bg.png'
import Button from 'react-bootstrap/Button';

import Navbar from './navbar';
import Carousel from 'react-bootstrap/Carousel';
import aboutUs from './assets/img/gallery/about-us.png'
import AboutBg from './assets/img/gallery/about-bg.png'
import doctorAbout from './assets/img/gallery/doctors-us.png'
import Anita from './assets/img/gallery/anita.png'
function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        // If the token doesn't exist, navigate to the login page
        navigate('/login');
        return;
      }
      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.type.toLowerCase();
      alert(userType);
      if (!userType || userType !== 'patient') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/myDoctors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);
  const handleChatClick = async (e, doctorId) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent elements
    const token = localStorage.getItem('token');

    // Check if a room already exists with the current patient and clicked doctor
    const response = await axios.post(`http://localhost:3001/createRoom`, { doctorId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(`/chat/${response.data.roomId}`);

  }
  const handleVideoCallClick = async (e, doctorId) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent elements
    const token = localStorage.getItem('token');

    // Check if a room already exists with the current patient and clicked doctor
    const response = await axios.post(`http://localhost:3001/createVideoRoom`, { doctorId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(`/video/${response.data.roomId}`);
  }
  const cardsData = [
    {
      title: 'Book an Appointment',
      description: 'Explore our expert doctors and effortlessly schedule your next consultation.',
      icon: <FaIcons.FaFileMedical style={{ height: "30px", width: "30px" }} />,
      path: '/listdoctors'
    },
    {
      title: 'Access Your Prescriptions',
      description: 'Download your prescriptions as PDFs and easily reorder your medications.',
      icon: <FaIcons.FaPrescriptionBottleAlt style={{ height: "30px", width: "30px" }} />,
      path: '/myPrescriptions'
    },
    {
      title: 'Unlock Health Package Benefits',
      description: 'Subscribe to a Health Package for exclusive discounts.',
      icon: <IoIcons.IoIosBody style={{ height: "30px", width: "30px" }} />,
      path: '/healthPackages'
    },
    {
      title: 'Connect with Family Health',
      description: 'Link accounts with family members and enhance collective healthcare management.',
      icon: <IoPersonAddSharp style={{ height: "30px", width: "30px" }} />,
      path: '/addFamilyMembers'
    },
    // Add more cards as needed
  ];

  return (
    <div>
      <div>
        <Navbar />
        <section className="py-xxl-10 pb-0" id="home">
          <div className="bg-holder bg-size" style={{ backgroundImage: `url(${Bg})`, backgroundPosition: 'top center', backgroundSize: 'cover' }}></div>
          <div className="container">
            <div className="row min-vh-xl-100 min-vh-xxl-25">
              <div className="col-md-5 col-xl-6 col-xxl-7 order-0 order-md-1 text-end">
                <img className="pt-7 pt-md-0 w-100" src={Hero} alt="hero-header" />
              </div>
              <div className="col-md-7 col-xl-6 col-xxl-5 text-md-start text-center py-6">
                <h1 className="fw-light font-base fs-6 fs-xxl-7">We're <strong>determined</strong> for<br />your&nbsp;<strong>better life.</strong></h1>
                <p className="fs-1 mb-5">You can get the care you need 24/7 – be it online or in <br />person. You will be treated by caring specialist doctors. </p>
                <a className="btn btn-lg btn-primary rounded-pill" href="/listdoctors" role="button">Make an Appointment</a>
              </div>
            </div>
          </div>
        </section>
        <div>
        <section style={{ maxHeight: "15vh", paddingTop: "20px", marginTop:'-150px'}}>
          <div id="section0">
            <div id="section0text">
              <h3 style={{ fontSize: "40px", fontWeight: "1000", letterSpacing: "2px", textAlign: "center" }}>Quick Menu</h3>
            </div>
            <div id="icons" style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: "4%" }}>
              {cardsData.map((card, index) => (
                <div
                  key={index}
                  id="iconItem"
                  style={{
                    width: "18%",
                    backgroundColor: "white",
                    border: "#000 2px solid",
                    borderTop: "navy 10px solid",
                    borderRadius: "10px",
                    transition: "transform 0.4s ease",
                    alignItems: "center",
                    textAlign: "center",
                    height: "250px",
                    padding: "20px",
                    margin: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(card.path)}
                >
                  {card.icon}
                  <h3 style={{ fontWeight: "bold", fontSize: "24px", marginTop: "10px", marginBottom: "10px" }}>{card.title}</h3>
                  <p style={{ marginBottom: "20px" }}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>
        

        <div className="d-flex justify-content-end">
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
              <Dropdown drop="up">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Contact Your Doctors
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {doctors.map((doctor) => (
                    <Dropdown.Item key={doctor.doctorId}>
                      <div className="d-flex align-items-center justify-content-between">
                        <span>{doctor.doctorName}</span>
                        <span style={{ marginLeft: '10px' }}>
                          {/* Add chat and video icons */}
                          <FaComment
                            style={{ marginRight: '10px', cursor: 'pointer' }}
                            onClick={(e) => handleChatClick(e, doctor.doctorId)}
                          />
                          <FaVideo
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onClick={(e) => handleVideoCallClick(e, doctor.doctorId)}
                          />
                        </span>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>





        {/*
        <MDBContainer className="mt-5" style={{marginLeft:'30%'}}>
          <MDBRow className="justify-content-center">

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Add Family Members</MDBCardTitle>
              <MDBCardText>Add new family members to your profile.</MDBCardText>
              <Link to="/addFamilyMembers">
                <MDBBtn color="primary">Add Members</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Existing Family Members</MDBCardTitle>
              <MDBCardText>View and manage your existing family members.</MDBCardText>
              <Link to="/myFamilyMembers">
                <MDBBtn color="info">View Members</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View List of All Doctors</MDBCardTitle>
              <MDBCardText>Explore a list of all available doctors.</MDBCardText>
              <Link to="/listdoctors">
                <MDBBtn color="success">View Doctors</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Available Subscription Packages</MDBCardTitle>
              <MDBCardText>View and subscribe to subscription packages</MDBCardText>
              <Link to="/healthPackages">
                <MDBBtn color="success">View Packages</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View My Appointments</MDBCardTitle>
              <MDBCardText>View and manage your scheduled appointments.</MDBCardText>
              <Link to="/myPAppointments">
                <MDBBtn color="warning">View Appointments</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View my Subscription</MDBCardTitle>
              <MDBCardText>View and manage your and your family members Subscriptions.</MDBCardText>
              <Link to="/mySubscription">
                <MDBBtn color="secondary">View Subscriptions</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Prescriptions</MDBCardTitle>
              <MDBCardText>View and manage your prescriptions.</MDBCardText>
              <Link to="/myPrescriptions">
                <MDBBtn color="secondary">View Prescriptions</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Change Password</MDBCardTitle>
              <MDBCardText>
                Change Your Password
              </MDBCardText>
              <Link to="/changePassword">
                <MDBBtn color="info">Change Password</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle> Medical History</MDBCardTitle>
              <MDBCardText>
                Upload/Remove Documents for Medical History
              </MDBCardText>
              <Link to="/modifyMedicalRecord">
                <MDBBtn color="info"> Modify Medical History</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Health Records</MDBCardTitle>
              <MDBCardText>
                View Health Records
              </MDBCardText>
              <Link to="/viewHealthRecords">
                <MDBBtn color="info">View Health Records</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    */}
      </div >

    </div >
  );
}

export default AdminDashboard;
