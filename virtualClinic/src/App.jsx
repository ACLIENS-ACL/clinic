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
import FamilyMembers from './addFamilyMembers'
import MyFamilyMembers from './patientFamily'
import PDashboard from './patientDashboard'
import ListDoctors from './listDoctors'
import ViewPatients from './viewPatients'
import PatientAppointments from './patientAppointments'
import DoctorAppointments from './doctorAppointments'
import Prescriptions from './presList'
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
        <Route path="/listdoctors" element={<ListDoctors />} />
        <Route path="/addFamilyMembers" element={<FamilyMembers />} />
        <Route path="/patient" element={<PDashboard />} />
        <Route path="/viewPatients" element={<ViewPatients />} />
        <Route path="/myFamilyMembers" element={<MyFamilyMembers />} />
        <Route path="/myPAppointments" element={<PatientAppointments />} />
        <Route path="/myDAppointments" element={<DoctorAppointments />} />
        <Route path="/myPrescriptions" element={<Prescriptions />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
