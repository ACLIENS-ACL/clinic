import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from './navbar';

function DoctorDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "doctor" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
  }, []);
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
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default DoctorDashboard;