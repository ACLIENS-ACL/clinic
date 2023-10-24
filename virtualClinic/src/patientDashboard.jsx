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

  const handleLogout = () => {
    axios.post(`http://localhost:3001/logout`)
      .then(() => {
        localStorage.removeItem('userToken'); 
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };
  return (

    <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">Patient Dashboard</a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <MDBBtn color="danger" onClick={handleLogout}>
              Logout
            </MDBBtn>
          </li>
        </ul>
      </div>
    </nav>

    <div style={{ marginTop: '200px' }}>
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
      </MDBRow>
    </MDBContainer>

    </div>
    </div>
  );
}

export default AdminDashboard;
