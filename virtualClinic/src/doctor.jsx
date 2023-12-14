import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import { IoPersonSharp } from 'react-icons/io5';
import { Dropdown } from 'react-bootstrap';
import CSS from './assets/css/theme.css';
import Bg from './assets/img/gallery/hero-bg.png';
import Hero from "./assets/img/gallery/hero.png";
import { FaComment, FaVideo } from 'react-icons/fa';

function DoctorDashboard() {
  const navigate = useNavigate();
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
      if (!userType || userType !== 'doctor') {
        // If the user is not a patient or is not logged in, navigate to the login page
        navigate('/login');
      }
    } catch (error) {

    }
  }, [navigate]);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/myPatients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);
  const handleChatClick = async (e, patientId) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent elements
    const token = localStorage.getItem('token');

    // Check if a room already exists with the current patient and clicked doctor
    const response = await axios.post(`http://localhost:3001/createRoomDoctor`, { patientId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(`/chat/${response.data.roomId}`);

  }
  const handleVideoCallClick = async (e, patientId) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent elements
    const token = localStorage.getItem('token');

    // Check if a room already exists with the current patient and clicked doctor
    const response = await axios.post(`http://localhost:3001/createVideoRoomDoctor`, { patientId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigate(`/video/${response.data.roomId}`);
  }
  const cardsData = [
    {
      title: 'Manage Appointments',
      description: 'Effortlessly organize and coordinate consultations with your patients.',
      icon: <FaIcons.FaCalendarAlt style={{ height: "30px", width: "30px" }} />,
      path: '/myDAppointments'
    },
    {
      title: 'Prescription Management',
      description: 'View and download prescriptions digitally for efficient patient care.',
      icon: <FaIcons.FaFilePrescription style={{ height: "30px", width: "30px" }} />,
      path: '/myPresList'
    },
    {
      title: 'Patient Overview',
      description: 'Access a comprehensive view of your patients and their health histories.',
      icon: <IoIcons.IoIosBody style={{ height: "30px", width: "30px" }} />,
      path: '/viewPatients'
    },
    {
      title: 'Profile Editing',
      description: 'Efficiently update and manage your hourly rate, affiliation and contact email.',
      icon: <IoPersonSharp style={{ height: "30px", width: "30px" }} />,
      path: '/edit-doctor-info'
    },

    // Add more cards as needed
  ];

  return (
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
              <h1 className="fw-light font-base fs-6 fs-xxl-7">Dedicated to <strong>enhancing health</strong> for a <strong>better tomorrow.</strong></h1>
              <p className="fs-1 mb-5">Provide personalized care with virtual or in-person consultations. Utilize our intuitive interface to deliver top-notch treatment as part of our dedicated team of specialist doctors.</p>
              <a className="btn btn-lg btn-primary rounded-pill" href="/myDAppointments" role="button">View your Appointments</a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '-250px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-100px' }}>
        <div id="section0">
          <div id="section0text">
            <h3 style={{ fontSize: "40px", fontWeight: "1000", letterSpacing: "2px", textAlign: "center" }}>Quick Menu</h3>
          </div>
          <div id="icons" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: 'wrap', marginTop: '20px' }}>
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
      <div className="d-flex justify-content-end">
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
            <Dropdown drop="up">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Contact Your Patients
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {patients.map((patient) => (
                  <Dropdown.Item key={patient.doctorId}>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{patient.patientName}</span>
                      <span style={{ marginLeft: '10px' }}>
                        {/* Add chat and video icons */}
                        <FaComment
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                          onClick={(e) => handleChatClick(e, patient.patientId)}
                        />
                        <FaVideo
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                          onClick={(e) => handleVideoCallClick(e, patient.patientId)}
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

    </div>
  );
}

export default DoctorDashboard;
<MDBContainer className="mt-5">
  <MDBRow className="justify-content-center">
    {/* Existing Cards */}
    <MDBCol md="4" className="mb-4">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Edit My Info</MDBCardTitle>
          <MDBCardText>
            Edit my personal information.
          </MDBCardText>
          <Link to="/edit-doctor-info">
            <MDBBtn color="primary">Edit Info</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

    <MDBCol md="4" className="mb-4">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>View Appointments</MDBCardTitle>
          <MDBCardText>
            View My Appointments.
          </MDBCardText>
          <Link to="/myDAppointments">
            <MDBBtn color="info">View</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>

    <MDBCol md="4" className="mb-4">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>View Patients</MDBCardTitle>
          <MDBCardText>
            View All Patients Registered With Me
          </MDBCardText>
          <Link to="/viewPatients">
            <MDBBtn color="info">View Patients</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
    <MDBCol md="4" className="mb-4">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Add Appointment Slots</MDBCardTitle>
          <MDBCardText>
            Add Appointments to Be Reserved by Patients
          </MDBCardText>
          <Link to="/addAppointments">
            <MDBBtn color="info">Add Appointments</MDBBtn>
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
          <MDBCardTitle>Follow Up Reqs</MDBCardTitle>
          <MDBCardText>
            View FollowUp Reqs
          </MDBCardText>
          <Link to="/followupReqs">
            <MDBBtn color="info">View Requests</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
    <MDBCol md="4" className="mb-4">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>View Prescriptions</MDBCardTitle>
          <MDBCardText>View and manage your prescriptions.</MDBCardText>
          <Link to="/myPresList">
            <MDBBtn color="secondary">View Prescriptions</MDBBtn>
          </Link>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>
</MDBContainer>