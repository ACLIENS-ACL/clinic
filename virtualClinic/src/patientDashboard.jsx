import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import Navbar from './navbar';

function AdminDashboard() {

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`).then((response) => {
      const responseData = response.data;
      if (responseData.type !== 'patient' || responseData.in !== true) {
        navigate('/login');
        return null;
      }
    });
  }, []);

  return (
    <div>
      <Navbar />
      <MDBContainer className="mt-5">
        <MDBRow className="justify-content-center">
          {/* Add Family Members Card */}
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

          {/* View Existing Family Members Card */}
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

          {/* View Subscription Packages Card */}
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

          {/* View My Appointments Card */}
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
          {/* View Subscription Card */}
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

          {/* View Prescriptions Card */}
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
    </div>
  );
}

export default AdminDashboard;
