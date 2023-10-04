import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

function App() {
  const gradientCustom2Style = {
    background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
  };

  const gradientFormStyle = {
    height: '100vh',
  };

  const gradientCustom2MobileStyle = {
    borderTopRightRadius: '.3rem',
    borderBottomRightRadius: '.3rem',
  };

  const [email, setEmail] = useState(''); // Initialize state for email
  const [password, setPassword] = useState(''); // Initialize state for password
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/login', {
        email,
        password
      })
      .then(result => {
        console.log(result);
        if (result.data === "Success") { // Use result.data to check the response data
          navigate('/'); // Navigate to the home page after successful login
        }
      })
      .catch(err => {
        console.log(err);
        // Handle error
      });
  };

  return (
    <MDBContainer className="my-5" style={gradientFormStyle}>
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{ width: '185px' }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Virtual Clinic</h4>
            </div>
            <p>Please login to your account</p>
            <form onSubmit={handleSubmit}>
              <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100" style={gradientCustom2Style} type="submit">Sign in</MDBBtn>
                <a className="text-muted" href="#!">Forgot password?</a>
              </div>
            </form>
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Link to="/register">
                <MDBBtn outline className='mx-2' color='danger'>
                  Sign Up!
                </MDBBtn>
              </Link>
            </div>
          </div>
          <div className="d-flex flex-column  justify-content-center" style={{ ...gradientCustom2Style, ...gradientCustom2MobileStyle }}>
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
