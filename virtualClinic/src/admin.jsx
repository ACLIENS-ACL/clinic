import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from './navbar';

function AdminDashboard() {
  const [mainAdmin, setMainAdmin] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
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
          {(!mainAdmin && (
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
          ))}
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default AdminDashboard;