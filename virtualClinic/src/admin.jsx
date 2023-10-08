import React from 'react';
import { Link } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

function AdminDashboard() {
  return (
    <MDBContainer className="mt-5">
      <MDBRow className="justify-content-center">
        {/* Existing Cards */}
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Register Admin</MDBCardTitle>
              <MDBCardText>
                Register a new admin user.
              </MDBCardText>
              <Link to="/register-admin">
                <MDBBtn color="primary">Register</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Edit Patients</MDBCardTitle>
              <MDBCardText>
                Edit existing Patients.
              </MDBCardText>
              <Link to="/edit-patients">
                <MDBBtn color="info">Edit Patients</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Edit Doctors</MDBCardTitle>
              <MDBCardText>
                Edit existing Doctors.
              </MDBCardText>
              <Link to="/edit-doctors">
                <MDBBtn color="info">Edit Doctors</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Doctor's Requests</MDBCardTitle>
              <MDBCardText>
                View and manage doctor's requests.
              </MDBCardText>
              <Link to="/view-requests">
                <MDBBtn color="success">View Requests</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* New Card for Modifying Health Packages */}
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Modify Health Packages</MDBCardTitle>
              <MDBCardText>
                Modify existing health packages.
              </MDBCardText>
              <Link to="/modify-packages">
                <MDBBtn color="warning">Modify Packages</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* New Card to Edit Admins */}
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Edit Admins</MDBCardTitle>
              <MDBCardText>
                Edit existing admin users.
              </MDBCardText>
              <Link to="/edit-admins">
                <MDBBtn color="secondary">Edit Admins</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default AdminDashboard;