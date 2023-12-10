import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import NeurologyIcon from './assets/img/icons/neurology.png';
import NeurologySvg from './assets/img/icons/neurology.svg'
import Logo from './assets/img/gallery/logo.png';
import CSS from './assets/css/theme.css';
import Bg from './assets/img/gallery/hero-bg.png';
import Hero from "./assets/img/gallery/hero.png"
import Depts from './assets/img/gallery/bg-departments.png'
import BgEye from './assets/img/gallery/bg-eye-care.png'
import EyeCare from './assets/img/icons/eye-care.png'
import EyeCareSvg from './assets/img/icons/eye-care.svg'
import EyeCareGal from './assets/img/gallery/eye-care.png'
import Cardiac from './assets/img/icons/cardiac.png'
import CardiacSvg from './assets/img/icons/cardiac.svg'
import healthCare from './assets/img/gallery/health-care.png'
import Heart from './assets/img/icons/heart.png'
import HeartSvg from './assets/img/icons/heart.svg'
import Carousel from 'react-bootstrap/Carousel';
import Ost from './assets/img/icons/osteoporosis.png';
import OstSvg from './assets/img/icons/osteoporosis.svg';
import Button from 'react-bootstrap/Button';
import aboutUs from './assets/img/gallery/about-us.png'
import AboutBg from './assets/img/gallery/about-bg.png'
import doctorAbout from './assets/img/gallery/doctors-us.png'
import Anita from './assets/img/gallery/anita.png'
import People from './assets/img/gallery/people.png'
import 'bootstrap/dist/css/bootstrap.min.css'; // Include Bootstrap CSS
import PeopleBg from './assets/img/gallery/people-bg-1.png'
import PeopleLoves from './assets/img/gallery/people-who-loves.png'
import DoctorsBg from './assets/img/gallery/doctors-bg.png'
import Footer from "./assets/img/gallery/footer-logo.png"
import DotBg from './assets/img/gallery/dot-bg.png'
const LandingPage = () => {
  localStorage.removeItem('token');
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const navigate = useNavigate();
  const handleNavigation = async (e) => {
    if (username) {
      navigate('/resetPassword')
    }
    else {
      navigate('/register')
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {


      const type = await axios.get('http://localhost:3001/getType', {
        params: { username: username },
      });

      const userType = type.data.userType
      if (userType === "not found") {
        setErrorUsername("invalid username")
      }
      else {
        const result = await axios.post(`http://localhost:3001/login-${userType}`, { username, password });

        const { message, token } = result.data;


        localStorage.setItem('token', token);

        if (message === 'Success But Not Enrolled') {
          const { token2 } = result.data;
          localStorage.setItem('token', token2);
          navigate('/makeReq');
        } else if (message === 'Waiting for contract') {
          navigate('/contract');
        } else if (message === 'Success' || message === 'success') {
          alert(message);
          const decodedToken = jwtDecode(token);
          if (decodedToken.type.toLowerCase() === 'admin') {
            navigate('/admin');
          } else if (decodedToken.type.toLowerCase() === 'doctor') {
            navigate('/doctor');
          } else if (decodedToken.type.toLowerCase() === 'patient') {
            navigate('/patient');
          } else {
            navigate('/register');
          }
        }
        if (message === "username isn't registered") {
          setErrorUsername(message);
          setErrorPassword('');
        }
        else if (message === "Password incorrect")
        setErrorUsername("");
          setErrorPassword(message);
      }
    } catch (err) {
      console.log(err);
      alert("Hello")
    }
  }
  return (
    <div>
      {/* Head Section */}
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Livedoc | Landing, Responsive & Business Templatee</title>

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="assets/img/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="assets/img/favicons/favicon-16x16.png" />
        <link rel="shortcut icon" type="image/x-icon" href="assets/img/favicons/favicon.ico" />
        <link rel="manifest" href="assets/img/favicons/manifest.json" />
        <meta name="msapplication-TileImage" content="assets/img/favicons/mstile-150x150.png" />
        <meta name="theme-color" content="#ffffff" />

        {/* Stylesheets */}
        <link href={CSS} rel="stylesheet" />
      </head>

      {/* Main Content */}
      <body>
        {/* Navbar */}
        <div style={{ backgroundImage: `url(${Bg})`, backgroundPosition: 'top center', backgroundSize: 'cover' }}>
          <nav className="navbar navbar-expand-lg navbar-light py-3 d-flex justify-content-between" style={{ width: '85%', margin: 'auto' }} data-navbar-on-scroll="data-navbar-on-scroll">
            <a className="navbar-brand" >
              <img src={Logo} width="118" alt="logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse border-top border-lg-0 mt-4 mt-lg-0 text-center" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto pt-2 pt-lg-0 font-base">
                <li className="nav-item px-2">
                  <a className="nav-link" aria-current="page" href="#about">
                    About Us
                  </a>
                </li>
                <li className="nav-item px-2">
                  <a className="nav-link" href="#departments">
                    Departments
                  </a>
                </li>
                <li className="nav-item px-2">
                  <a className="nav-link" href="#contact">
                    Contact
                  </a>
                </li>
                {/* Add other list items as needed */}
              </ul>
            </div>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className={`form-control form-control-sm me-2 ${errorUsername ? 'is-invalid' : ''}`}
                style={{ maxWidth: '120px', borderColor: errorUsername ? 'red' : '' }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                className={`form-control form-control-sm me-2 ${errorPassword ? 'is-invalid' : ''}`}
                style={{ maxWidth: '120px', borderColor: errorPassword ? 'red' : '' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn btn-sm btn-primary rounded-pill" onClick={(e) => handleSubmit(e)}>
                Login
              </button>
              <a
                className="ms-2"
                style={{
                  textDecoration: 'none',
                  color: 'grey',
                  cursor: 'pointer',
                  transition: 'color 0.2s, text-decoration 0.2s',
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                  e.target.style.color = 'navy';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                  e.target.style.color = 'grey';
                }}
                onClick={(e) => handleNavigation(e)}
              >
                {username ? "Forgot Password?" : "Don't have an Account?"}
              </a>
            </div>
          </nav>
        </div>

        <section className="py-xxl-10 pb-0" id="home">
          <div className="bg-holder bg-size" style={{ backgroundImage: `url(${Bg})`, backgroundPosition: 'top center', backgroundSize: 'cover' }}></div>
          <div className="container">
            <div className="row min-vh-xl-100 min-vh-xxl-25">
              <div className="col-md-5 col-xl-6 col-xxl-7 order-0 order-md-1 text-end">
                <img className="pt-7 pt-md-0 w-100" src={Hero} alt="hero-header" />
              </div>
              <div className="col-md-7 col-xl-6 col-xxl-5 text-md-start text-center py-6">
                <h1 className="fw-light font-base fs-6 fs-xxl-7">We're <strong>determined</strong> for<br />your&nbsp;<strong>better life.</strong></h1>
                <p className="fs-1 mb-5">You can get the care you need 24/7 – be it online or in <br />person. You will be treated by caring specialist doctors. </p>
                <a className="btn btn-lg btn-primary rounded-pill" href="#!" role="button">Make an Appointment</a>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-0" id="departments">
          <div className="container">
            <div className="row">
              <div className="col-12 py-0">
                <div className="bg-holder bg-size" style={{ backgroundImage: `url(${Depts})`, backgroundPosition: 'top center', backgroundSize: 'contain' }}></div>
                <h1 className="text-center">OUR DEPARTMENTS</h1>
              </div>
            </div>
          </div>
        </section>

        {/* Department Icons Section */}
        <section className="py-0">
          <div className="container">
            <div className="row py-5 align-items-center justify-content-center justify-content-lg-evenly">
              {/* Repeat the following block for each department */}
              <div className="col-auto col-md-4 col-lg-auto text-xl-start">
                <div className="d-flex flex-column align-items-center">
                  <div className="icon-box text-center">
                    <a className="text-decoration-none" href="#!">
                      <img className="mb-3 deparment-icon" src={NeurologyIcon} alt="..." />
                      <img className="mb-3 deparment-icon-hover" src={NeurologySvg} alt="..." />
                      <p className="fs-1 fs-xxl-2 text-center">Neurology</p>
                    </a></div>
                </div>
              </div>
              <div class="col-auto col-md-4 col-lg-auto text-xl-start">
                <div class="d-flex flex-column align-items-center">
                  <div class="icon-box text-center"><a class="text-decoration-none" href="#!"><img class="mb-3 deparment-icon" src={EyeCare} alt="..." /><img class="mb-3 deparment-icon-hover" src={EyeCareSvg} alt="..." />
                    <p class="fs-1 fs-xxl-2 text-center">Eye care</p>
                  </a></div>
                </div>
              </div>
              <div class="col-auto col-md-4 col-lg-auto text-xl-start">
                <div class="d-flex flex-column align-items-center">
                  <div class="icon-box text-center"><a class="text-decoration-none" href="#!"><img class="mb-3 deparment-icon" src={Cardiac} alt="..." /><img class="mb-3 deparment-icon-hover" src={CardiacSvg} alt="..." />
                    <p class="fs-1 fs-xxl-2 text-center">Cardiac care</p>
                  </a></div>
                </div>
              </div>
              <div class="col-auto col-md-4 col-lg-auto text-xl-start">
                <div class="d-flex flex-column align-items-center">
                  <div class="icon-box text-center"><a class="text-decoration-none" href="#!"><img class="mb-3 deparment-icon" src={Heart} alt="..." /><img class="mb-3 deparment-icon-hover" src={HeartSvg} alt="..." />
                    <p class="fs-1 fs-xxl-2 text-center">Heart care</p>
                  </a></div>
                </div>
              </div>
              <div class="col-auto col-md-4 col-lg-auto text-xl-start">
                <div class="d-flex flex-column align-items-center">
                  <div class="icon-box text-center"><a class="text-decoration-none" href="#!"><img class="mb-3 deparment-icon" src={Ost} alt="..." /><img class="mb-3 deparment-icon-hover" src={OstSvg} alt="..." />
                    <p class="fs-1 fs-xxl-2 text-center">Osteoporosis</p>
                  </a></div>
                </div>
              </div>

            </div>
          </div>
          {/* Repeat the block for other departments */}
        </section >
        <section className="bg-secondary">
          <div className="bg-holder" style={{ backgroundImage: `url${BgEye}`, backgroundPosition: 'center', backgroundSize: 'contain' }}></div>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-5 col-xxl-6">
                <img className="img-fluid" src={EyeCareGal} alt="Eye Care" />
              </div>
              <div className="col-md-7 col-xxl-6 text-center text-md-start">
                <h2 className="fw-bold text-light mb-4 mt-4 mt-lg-0">Eye Care with Top Professionals<br className="d-none d-sm-block" />and In Budget.</h2>
                <p className="text-light">We've built a healthcare system that puts your needs first.<br className="d-none d-sm-block" />For us, there is nothing more important than the health of <br className="d-none d-sm-block" />you and your loved ones. </p>
                <div className="py-3">
                  <a className="btn btn-lg btn-light rounded-pill" href="#!" role="button">Learn more </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-0" id="about">
          <div className="container">
            <div className="row">
              <div className="col-12 py-3">
                <div className="bg-holder bg-size" style={{ backgroundImage: `url(${aboutUs})`, backgroundPosition: 'top center', backgroundSize: 'contain' }}></div>
                <h1 className="text-center">ABOUT US</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="bg-holder bg-size" style={{ backgroundImage: `url(${AboutBg})`, backgroundPosition: 'top center', backgroundSize: 'contain' }}></div>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 order-lg-1 mb-5 mb-lg-0">
                <img className="fit-cover rounded-circle w-100" src={healthCare} alt="Health Care" />
              </div>
              <div className="col-md-6 text-center text-md-start">
                <h2 className="fw-bold mb-4">We are developing a healthcare <br className="d-none d-sm-block" />system around you</h2>
                <p>We think that everyone should have easy access to excellent <br className="d-none d-sm-block" />healthcare. Our aim is to make the procedure as simple as <br className="d-none d-sm-block" />possible for our patients and to offer treatment no matter<br className="d-none d-sm-block" />where they are — in person or at their convenience. </p>
                <div className="py-3">
                  <button className="btn btn-lg btn-outline-primary rounded-pill" type="submit">Learn more </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-0">
          <div className="container">
            <div className="row">
              <div className="col-12 py-3">
                <div className="bg-holder bg-size" style={{ backgroundImage: `url(${doctorAbout})`, backgroundPosition: 'top center', backgroundSize: 'contain' }}></div>
                <h1 className="text-center">OUR DOCTORS</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="py-0">
          <div className="bg-holder bg-size" style={{ backgroundImage: `url(${DoctorsBg})`, backgroundPosition: 'top center', backgroundSize: 'contain' }}></div>
          <div className="container">
            <div className="row flex-center">
              <div className="col-xl-10 px-0">
                <Carousel id="carouselExampleDark" className="carousel slide" interval={10000} pause="hover">
                  {/* Repeat the following Carousel.Item block for each carousel item */}
                  <Carousel.Item>
                    <div className="row h-100 m-lg-7 mx-3 mt-6 mx-md-4 my-md-7">
                      {/* Repeat the following block for each card within the carousel item */}
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Repeat the above block for each additional card within the carousel item */}
                    </div>
                  </Carousel.Item>
                  <Carousel.Item>
                    <div className="row h-100 m-lg-7 mx-3 mt-6 mx-md-4 my-md-7">
                      {/* Repeat the following block for each card within the carousel item */}
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Repeat the above block for each additional card within the carousel item */}

                      {/* Repeat the following block for the next card within the carousel item */}
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Repeat the above block for each additional card within the carousel item */}

                      {/* Repeat the following block for the next card within the carousel item */}
                      <div className="col-md-4 mb-8 mb-md-0">
                        <div className="card card-span h-100 shadow">
                          <div className="card-body d-flex flex-column flex-center py-5">
                            <img src={Anita} width="128" alt="..." />
                            <h5 className="mt-3">Anita Deshai</h5>
                            <p className="mb-0 fs-xxl-1">Pediatrics, Gochi Medicine</p>
                            <p className="text-600 mb-0">Florida, United States</p>
                            <p className="text-600 mb-4">10 years experience</p>
                            <div className="text-center">
                              <Button variant="outline-secondary" className="rounded-pill" type="submit">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Repeat the above block for each additional card within the carousel item */}
                    </div>
                  </Carousel.Item>
                  {/* Repeat the above Carousel.Item block for each additional carousel item */}
                </Carousel>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container">
            <div className="row">
              <div className="col-12 py-3">
                <div
                  className="bg-holder bg-size"
                  style={{
                    backgroundImage: `url(${People})`,
                    backgroundPosition: 'top center',
                    backgroundSize: 'contain'
                  }}
                ></div>
                <h1 className="text-center">PEOPLE WHO LOVE US</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="bg-holder bg-size" style={{ backgroundImage: `url(${PeopleBg})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
          <div className="container">
            <div className="row align-items-center offset-sm-1">
              <Carousel id="carouselPeople" interval={10000} indicators={false}>
                <Carousel.Item>
                  <div className="row h-100">
                    <div className="col-sm-3 text-center">
                      <img src={PeopleLoves} width="100" alt="" />
                      <h5 className="mt-3 fw-medium text-secondary">Edward Newgate</h5>
                      <p className="fw-normal mb-0">Founder Circle</p>
                    </div>
                    <div className="col-sm-9 text-center text-sm-start pt-3 pt-sm-0">
                      <h2>Fantastic Response!</h2>
                      <div class="my-2"><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star-half-alt me-2"></i><i class="far fa-star"></i></div>
                      <p>This medical and health care facility distinguishes itself from the competition by providing technologically advanced medical and health care. A mobile app and a website are available via which you can easily schedule appointments, get online consultations, and see physicians, who will assist you through the whole procedure. And all of the prescriptions, medications, and other services they offer are 100% genuine, medically verified, and proved. I believe that the Livedoc staff is doing an outstanding job. Highly recommended their health care services.</p>
                    </div>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="row h-100">
                    <div className="col-sm-3 text-center">
                      <img src={PeopleLoves} width="100" alt="" />
                      <h5 className="mt-3 fw-medium text-secondary">Jhon Doe</h5>
                      <p className="fw-normal mb-0">UI/UX Designer</p>
                    </div>
                    <div className="col-sm-9 text-center text-sm-start pt-3 pt-sm-0">
                      <h2>Fantastic Response!</h2>
                      <div class="my-2"><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star-half-alt me-2"></i><i class="far fa-star"></i></div>
                      <p>This medical and health care facility distinguishes itself from the competition by providing technologically advanced medical and health care. A mobile app and a website are available via which you can easily schedule appointments, get online consultations, and see physicians, who will assist you through the whole procedure. And all of the prescriptions, medications, and other services they offer are 100% genuine, medically verified, and proved. I believe that the Livedoc staff is doing an outstanding job. Highly recommended their health care services.</p>
                    </div>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="row h-100">
                    <div className="col-sm-3 text-center">
                      <img src={PeopleLoves} width="100" alt="" />
                      <h5 className="mt-3 fw-medium text-secondary">Jeny Doe</h5>
                      <p className="fw-normal mb-0">Web Designer</p>
                    </div>
                    <div className="col-sm-9 text-center text-sm-start pt-3 pt-sm-0">
                      <h2>Fantastic Response!</h2>
                      <div class="my-2"><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star me-2"></i><i class="fas fa-star-half-alt me-2"></i><i class="far fa-star"></i></div>
                      <p>This medical and health care facility distinguishes itself from the competition by providing technologically advanced medical and health care. A mobile app and a website are available via which you can easily schedule appointments, get online consultations, and see physicians, who will assist you through the whole procedure. And all of the prescriptions, medications, and other services they offer are 100% genuine, medically verified, and proved. I believe that the Livedoc staff is doing an outstanding job. Highly recommended their health care services.</p>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </section>
        <section className="py-0 bg-secondary" id="contact">
          <div className="bg-holder opacity-25" style={{ backgroundImage: `url(${DotBg})`, backgroundPosition: 'top left', marginTop: '-3.125rem', backgroundSize: 'auto' }}>
          </div>

          <div className="container">
            <div className="row py-8">
              <div className="col-12 col-sm-12 col-lg-6 mb-4 order-0 order-sm-0">
                <a className="text-decoration-none" href="#"><img src={Footer} height="51" alt="" /></a>
                <p className="text-light my-4">The world's most trusted <br />telehealth company.</p>
              </div>
              <div class="col-6 col-sm-4 col-lg-2 mb-3 order-2 order-sm-1">
                <h5 class="lh-lg fw-bold mb-4 text-light font-sans-serif">Departments</h5>
                <ul class="list-unstyled mb-md-4 mb-lg-0">
                  <li class="lh-lg"><a class="footer-link" href="#!">Eye care</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Cardiac are</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Heart care</a></li>
                </ul>
              </div>
              <div class="col-6 col-sm-4 col-lg-2 mb-3 order-3 order-sm-2">
                <h5 class="lh-lg fw-bold text-light mb-4 font-sans-serif">Membership</h5>
                <ul class="list-unstyled mb-md-4 mb-lg-0">
                  <li class="lh-lg"><a class="footer-link" href="#!">Free trial</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Silver</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Premium</a></li>
                </ul>
              </div>
              <div class="col-6 col-sm-4 col-lg-2 mb-3 order-3 order-sm-2">
                <h5 class="lh-lg fw-bold text-light mb-4 font-sans-serif"> Customer Care</h5>
                <ul class="list-unstyled mb-md-4 mb-lg-0">
                  <li class="lh-lg"><a class="footer-link" href="#!">About Us</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Contact US</a></li>
                  <li class="lh-lg"><a class="footer-link" href="#!">Get Update</a></li>
                </ul>
              </div>
            </div>
          </div>

        </section>
      </body >
    </div >
  );
};

export default LandingPage;
