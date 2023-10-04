import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio
} from 'mdb-react-ui-kit';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/register', {
        firstName,
        lastName,
        gender,
        birthday,
        emailAddress,
        phoneNumber
      })
      .then(result => {
        console.log(result);
        navigate('/login'); // Navigate to the /login route after successful submission
      })
      .catch(err => {
        console.log(err);
        // Handle error
      });
  };
  

  const formStyle = {
    background: 'linear-gradient(to bottom right, rgba(240, 147, 251, 1), rgba(245, 87, 108, 1))',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={formStyle}>
      <MDBContainer fluid>
        <MDBRow className='justify-content-center align-items-center m-5'>
          <MDBCard>
            <MDBCardBody className='px-4'>
              <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Registration Form</h3>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='First Name' size='lg' id='form1' type='text' onChange={(e) => setFirstName(e.target.value)} />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Last Name' size='lg' id='form2' type='text' onChange={(e) => setLastName(e.target.value)} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Birthday' size='lg' id='form3' type='text' onChange={(e) => setBirthday(e.target.value)} />
                  </MDBCol>
                  <MDBCol md='6' className='mb-4'>
                    <h6 className="fw-bold">Gender: </h6>
                    <MDBRadio name='inlineRadio' id='inlineRadio1' value='female' label='Female' inline onChange={(e) => setGender(e.target.value)} />
                    <MDBRadio name='inlineRadio' id='inlineRadio2' value='male' label='Male' inline onChange={(e) => setGender(e.target.value)} />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form4' type='email' onChange={(e) => setEmailAddress(e.target.value)} />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Phone Number' size='lg' id='form5' type='tel' onChange={(e) => setPhoneNumber(e.target.value)} />
                  </MDBCol>
                </MDBRow>
                <MDBBtn className='mb-4' size='lg' type="submit">Submit</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Signup;
