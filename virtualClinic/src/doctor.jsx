import React from 'react';
import { Link } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

function DoctorDashboard() {
  return (
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
              <Link to="/register-admin">
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
              <Link to="/edit-patients">
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
              <Link to="/edit-doctors">
                <MDBBtn color="info">View Patients</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default DoctorDashboard;