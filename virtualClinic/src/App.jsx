import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signup';
import Login from './login';
import Admin from './admin';
import RegisterAdmin from './register-admin'
import DoctorsRequests from './doctorsReq'
import EditAdmins from './editAdmins'
import EditPatients from './editPatients'
import EditDoctors from './editDoctors'
import Doctor from './doctor'
import Packages from './healthPackages'
import DoctorInfo from './editInfo'
import MakeReq from './makeReq'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/makeReq" element={<MakeReq />}/>
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/view-requests" element={<DoctorsRequests />} />
        <Route path="/edit-admins" element={<EditAdmins />} />
        <Route path="/edit-patients" element={<EditPatients />} />
        <Route path="/edit-doctors" element={<EditDoctors />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/modify-packages" element={<Packages />} />
        <Route path="/edit-doctor-info" element={<DoctorInfo />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
