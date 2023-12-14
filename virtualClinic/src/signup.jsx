/*import React, { useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [userType, setUserType] = useState('patient'); // Default to 'patient'
  const [username, setUsername] = useState('');
  const [nationalID, setnationalID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(''); // New state for selected specialty
  const [idDocument, setIdDocument] = useState(null);
  const [medicalLicenses, setMedicalLicenses] = useState([]);
  const [medicalDegree, setMedicalDegree] = useState(null);
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState('');

  const specialties = [ // Array of medical specialties
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Ophthalmology',
    'Pediatrics',
  ];

  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError('Password must contain at least 8 characters, one capital letter, one small letter, one special character, and one number.');
      return;
    }

    const userData = {
      username,
      name,
      email,
      password,
      dob,
      gender,
      mobileNumber,
    };
    if (userType === 'patient') {
      userData.emergencyContactName = emergencyContactName;
      userData.emergencyContactNumber = emergencyContactNumber;
      userData.nationalID = nationalID;
    } else if (userType === 'doctor') {
      userData.hourlyRate = hourlyRate;
      userData.affiliation = affiliation;
      userData.educationalBackground = educationalBackground;
      userData.specialty = selectedSpecialty; // Include selected specialty for doctors
    }

    axios
      .post(`http://localhost:3001/register-${userType}`, userData)
      .then(result => {
        if (userType.toLowerCase() == "doctor") {
          alert("Please Login to Make a Request!");

          const formData = new FormData();
          formData.append('idDocument', idDocument);

          axios.post(`http://localhost:3001/upload-id-document/${username}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const formData2 = new FormData();
          formData2.append('medicalDegree', medicalDegree);
          axios.post(`http://localhost:3001/upload-medical-degree/${username}`, formData2, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const formData3 = new FormData();
          for (let i = 0; i < medicalLicenses.length; i++) {
            formData3.append('medicalLicenses', medicalLicenses[i]);
          }
          axios.post(`http://localhost:3001/upload-medical-licenses/${username}`, formData3, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        navigate('/login')

      })
      .catch(err => {
        console.log(err);

        if (err.response && err.response.data) {
          // Display an error message to the user indicating that the username already exists.
          setErrorMessage(err.response.data.message);
        } else if (err.response && err.response.data && err.response.data.message === 'An account with the same email already exists') {
          setErrorMessage('An account with the same email already exists');
        } else if (err.response && err.response.data && err.response.data.message === 'An account with the same phone number already exists') {
          setErrorMessage('An account with the same phone number already exists');
        }
        else {
          // Handle other errors
          console.error('An error occurred during registration:', err);
        }
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
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <div className="mt-4">
                <p>Select User Type:</p>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">
                {userType === 'patient' ? 'Patient Registration' : 'Doctor Registration'}
              </h3>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Username' size='lg' id='form1' type='text' onChange={(e) => setUsername(e.target.value.toLowerCase())} required />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Full Name' size='lg' id='form2' type='text' onChange={(e) => setName(e.target.value)} required />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form4' type='email' onChange={(e) => setEmail(e.target.value)} required />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form5' type='password' onChange={(e) => setPassword(e.target.value)} required />
                    <p className="text-danger">{passwordError}</p>
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Date of Birth' size='lg' id='form6' type='date' onChange={(e) => setDob(e.target.value)} required />
                  </MDBCol>
                  <MDBCol md='6' className='mb-4'>
                    <h6 className="fw-bold">Gender: </h6>
                    <MDBRadio name='inlineRadio' id='inlineRadio1' value='female' label='Female' inline onChange={(e) => setGender(e.target.value)} required />
                    <MDBRadio name='inlineRadio' id='inlineRadio2' value='male' label='Male' inline onChange={(e) => setGender(e.target.value)} required />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Mobile Number' size='lg' id='form7' type='tel' onChange={(e) => setMobileNumber(e.target.value)} required />
                  </MDBCol>
                  {userType === 'patient' && (
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='National ID' size='lg' id='form7' type='tel' onChange={(e) => setnationalID(e.target.value)} required />
                      <MDBInput wrapperClass='mb-4' label='Emergency Contact Name' size='lg' id='form8' type='text' onChange={(e) => setEmergencyContactName(e.target.value)} required />
                      <MDBInput wrapperClass='mb-4' label='Emergency Contact Number' size='lg' id='form9' type='tel' onChange={(e) => setEmergencyContactNumber(e.target.value)} required />
                    </MDBCol>
                  )}
                  {userType === 'doctor' && (
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='Hourly Rate' size='lg' id='form10' type='number' onChange={(e) => setHourlyRate(e.target.value)} required />
                      <MDBInput wrapperClass='mb-4' label='Affiliation (Hospital)' size='lg' id='form11' type='text' onChange={(e) => setAffiliation(e.target.value)} required />
                      <MDBInput wrapperClass='mb-4' label='Educational Background' size='lg' id='form12' type='text' onChange={(e) => setEducationalBackground(e.target.value)} required />
                      <div className="mb-4">
                        <label htmlFor="specialty" className="form-label">Specialty</label>
                        <select
                          id="specialty"
                          className="form-select"
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select a specialty</option>
                          {specialties.map((specialty, index) => (
                            <option key={index} value={specialty}>{specialty}</option>
                          ))}
                        </select>
                      </div>

                      {/* ID Document }
                      <div className="mb-4">
                        <label htmlFor="idDocument" className="form-label">ID Document</label>
                        <input
                          id="idDocument"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setIdDocument(e.target.files[0])}
                          required
                        />
                      </div>

                      {/* Medical License}
<div className="mb-4">
  <label htmlFor="medicalLicense" className="form-label">Medical License</label>
  <input
    id="medicalLicense"
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) => setMedicalLicenses(e.target.files)}
    required
    multiple
  />
</div>

{/* Medical Degree }
                      <div className="mb-4">
                        <label htmlFor="medicalDegree" className="form-label">Medical Degree</label>
                        <input
                          id="medicalDegree"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setMedicalDegree(e.target.files[0])}
                          required
                        />
                      </div>
                    </MDBCol>
                  )}
                </MDBRow>
                <MDBBtn className='mb-4' size='lg' type="submit" onSubmit={handleSubmit}>Submit</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Signup;
*/
import React, { useState, useEffect } from 'react';
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
//import "./index.css";
import { json } from "./json";
import axios from 'axios';

function SurveyComponent() {
  const tempFileStorage = {};
  const survey = new Model(json);
  async function validation(_, { data, errors, complete }) {
    const password = data["password"];
    const userType = data["userType"];

    if (userType === "Patient") {
      const userData = {
        username: data["username"],
        name: data["full-name"],
        email: data["email"],
        password: data["password"],
        dob: data["birthdate"],
        gender: data["gender"],
        mobileNumber: data["phone"],
        emergencyContactName: data["emergency-contact-full-name"],
        emergencyContactNumber: data["emergency-contact-phone"],
        nationalID: data["nationalid"]
      };
      // Make an Axios call to check if the username and email already exist
      try {
        const response = await axios.post('http://localhost:3001/register-patient', userData);

        // Check the response for any error and set the appropriate error message
        if (response.data.message == "Username already exists") {
          errors["username"] = response.data.message;

        }
        else if (response.data.message == "An account with the same phone number already exists") {
          errors["phone"] = response.data.message;
        }
        else if (response.data.message == "An account with the same email already exists") {
          errors["email"] = response.data.message;
        }

      } catch (error) {
        // Handle any Axios request error (e.g., network issue)
        console.error(error);
        if (response.data.message == "Username already exists") {
          errors["username"] = response.data.message;

        }
        else if (response.data.message == "An account with the same phone number already exists") {
          errors["phone"] = response.data.message;
        }
        else if (response.data.message == "An account with the same email already exists") {
          errors["email"] = response.data.message;
        }
      }
    }
    if (userType === "Doctor") {
      const userData = {
        username: data["username"].toLowerCase(),
        name: data["full-name"],
        email: data["email"],
        password: data["password"],
        dob: data["birthdate"],
        gender: data["gender"],
        mobileNumber: data["phone"],
        hourlyRate: data["hourly-rate"],
        affiliation: data["affiliation"],
        educationalBackground: data["educational-background"],
        specialty: data["selectedSpecialty"],
      };
      // Make an Axios call to check if the username and email already exist
      try {
        const response = await axios.post('http://localhost:3001/register-doctor', userData);

        // Check the response for any error and set the appropriate error message
        if (response.data.message == "Username already exists") {
          errors["username"] = response.data.message;

        }
        else if (response.data.message == "An account with the same phone number already exists") {
          errors["phone"] = response.data.message;
        }
        else if (response.data.message == "An account with the same email already exists") {
          errors["email"] = response.data.message;
        }

        if (response.data.message === "completed") {
          const formData = new FormData();
          formData.append("idDocument", tempFileStorage["idDocument"]);
          await axios.post(`http://localhost:3001/upload-id-document/${data["username"].toLowerCase()}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const formData2 = new FormData();
          formData2.append("medicalDegree", tempFileStorage["medicalDegree"]);

          await axios.post(`http://localhost:3001/upload-medical-degree/${data["username"].toLowerCase()}`, formData2, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const formData3 = new FormData();
          formData3.append("medicalLicenses", tempFileStorage["medicalLicenses"]);
          await axios.post(`http://localhost:3001/upload-medical-licenses/${data["username"].toLowerCase()}`, formData3, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }



      } catch (error) {
        // Handle any Axios request error (e.g., network issue)
        console.error(error);

      }
    }
    if (!password) {
      errors["password"] = "Password is required.";
    } else if (password.length < 8) {
      errors["password"] = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      errors["password"] = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      errors["password"] = "Password must contain at least one lowercase letter.";
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      errors["password"] = "Password must contain at least one special character.";
    }


    complete();
  }

  survey.applyTheme(themeJson);
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });


  // Handles selected files
  survey.onUploadFiles.add((_, options) => {
    // Add files to the temporary storage
    if (tempFileStorage[options.name] !== undefined) {
      tempFileStorage[options.name].concat(options.files[0]);
    } else {
      tempFileStorage[options.name] = options.files[0];
    }
    // Load file previews
    const content = [];
    options.files.forEach(file => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        content.push({
          name: file.name,
          type: file.type,
          content: fileReader.result,
          file: file
        });
        if (content.length === options.files.length) {
          // Return a file for preview as a { file, content } object 
          options.callback(
            "success",
            content.map(fileContent => {
              return {
                file: fileContent.file,
                content: fileContent.content
              };
            })
          );
        }
      };
      fileReader.readAsDataURL(file);
    });
  });

  survey.onServerValidateQuestions.add(validation);


  return (<Survey model={survey} />);
}

export default SurveyComponent;