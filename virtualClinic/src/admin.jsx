import React, { useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';


function AdminDashboard() {

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/get-user-type`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "admin" || responseData.in !== true) {
          navigate('/login')
          return null;
        }
      })
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
        <a className="navbar-brand" href="/">Admin Dashboard</a>
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
    </div>
    </div>
  );

  
}

export default AdminDashboard;