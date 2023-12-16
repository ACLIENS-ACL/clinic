import { useState, useEffect } from 'react';
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
import HealthPackages from './availpackages'
import Subscriptions from './subscriptions'
import Payment from './payment'
import Appoint from './appointments'
import Password from './changePassowrd'
import Reset from './resetPassword'
import MedicalRecords from './medicalRecords'
import Contract from './contract'
import HealthRecords from './healthRecords'
import PaymentTwo from './paymentTwo';
import FollowUpReq from './followUpReqs';
import Video from './video'
import Chat from './chat'
import ChatPharmacy from './chatPharmacy'
import Prescription from './prescriptions';
import PresListDoctor from './presListDoctors'
import CartView from './cart';
import PaymentOrder from './payOrder';
import MyDoctors from './doctorsContact'
import MyPatients from './patientsContact'
import ModPackages from './modifyPackages'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/makeReq" element={<MakeReq />} />
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
        <Route path="/healthPackages" element={<HealthPackages />} />
        <Route path="/mySubscription" element={<Subscriptions />} />
        <Route path="/pay/:totalPaymentDue/:type/:packageId/:self/:selectedFamilyMembers" element={<Payment />} />
        <Route path="/payAppointment/:totalPaymentDue/:type/:doctorId/:dateTime/:familyMemberId" element={<PaymentTwo />} />
        <Route path="/addAppointments" element={<Appoint />} />
        <Route path="/changePassword" element={<Password />} />
        <Route path="/resetPassword" element={<Reset />} />
        <Route path="/modifyMedicalRecord" element={<MedicalRecords />} />
        <Route path="/viewHealthRecords" element={<HealthRecords />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/followupReqs" element={<FollowUpReq />} />
        {/* <Route path="/video" element={<Video />} /> */}
        <Route path="/chat/:roomId" element={<Chat />} />
        <Route path="/chatPharmacy/:roomId" element={<ChatPharmacy />} />
        <Route path="/video/:roomId" element={<Video />} />
        <Route path="/prescription/:appointmentId" element={<Prescription />} />
        <Route path="/myPresList" element={<PresListDoctor />} />
        <Route path="/cart/:prescriptionID" element={<CartView />} />
        <Route path="/payOrder" element={<PaymentOrder />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/myDoctors" element={<MyDoctors />} />
        <Route path="/myPatients" element={<MyPatients />} />
        <Route path="/modifyPackages" element={<ModPackages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
