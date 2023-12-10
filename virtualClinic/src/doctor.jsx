import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from './navbar';
import { jwtDecode } from "jwt-decode";

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
  return (
    <div>
      <Navbar />

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
    </div>
  );
}

export default DoctorDashboard;