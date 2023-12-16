## Project Title
El7a2ny Virtual Clinic🏥

## Motivation
The goal of this project is to create a system that facilitates seamless communication between doctors and patients, providing easy access to information and enabling patients to make reservations effortlessly.

## Build Status
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
* All user requirements are met and fulfilled, but more testing is needed to ensure the best service and UX.
* This project is currently a work-in-progress.
* The project requires further testing

## Code Style

In this project, we adhere to standardized JavaScript coding style conventions to enhance code readability and maintainability. Here are the key aspects of our coding style:

- **Semicolons:** A semicolon is present after each statement.
- **Function Declarations:** All functions are declared above the code that uses them.
- **Variable Naming Conventions:** We follow naming conventions for local variables, utilizing camelCase lettering starting with a lowercase letter.

- **Formatting in Visual Studio Code:**
  - The code is formatted in Visual Studio Code using the Alt + Shift + F command.
  - **Tab Size:** Set to 4 spaces.

These practices contribute to a consistent and organized codebase, making it easier to collaborate and maintain the project.

## Screenshots
- **Landing Page**
![Landing Page](https://github.com/ACLIENS-ACL/clinic/blob/main/LandingPage.png)
- **Admin Home**
![Admin Home](https://github.com/ACLIENS-ACL/clinic/blob/main/adminHome.png)
- **Adding Packages**
![Adding Packages](https://github.com/ACLIENS-ACL/clinic/blob/main/adminPackages.png)

- **Doctor's Home**
![Doctor's Home](https://github.com/ACLIENS-ACL/clinic/blob/main/doctorHome.png)
- **Viewing Appointments Doctor's Inteface**
![Viewing Appointments Doctor's Inteface](https://github.com/ACLIENS-ACL/clinic/blob/main/doctorAppointments.png)
- **Viewing Presciptions Doctor's Inteface**
![Viewing Presciptions Doctor's Inteface](https://github.com/ACLIENS-ACL/clinic/blob/main/doctorPrescriptiosn.png)
- **Patient Home**
![Patient Home](https://github.com/ACLIENS-ACL/clinic/blob/main/patientHome.png)
- **Viewing Family Members**
![Viewing Family Members](https://github.com/ACLIENS-ACL/clinic/blob/main/familyMember.png)
- **Viewing Available Doctors**
![Viewing Available Doctors](https://github.com/ACLIENS-ACL/clinic/blob/main/availableDoctors.png)
- **Viewing Appointments Patient's Inteface**
![Viewing Appointments Patient's Inteface](https://github.com/ACLIENS-ACL/clinic/blob/main/patientAppointmnets.png)

# Tech/Framework Used 🖥️

1. <details><summary>In Back-end</summary> 
    
    * NodeJS
    
    * Nodemailer
    
    * MongoDB
    
    * Mongoose
  
    * Express
  
    * Body-parser
  
    * Cors
  
    * Fs
  
    * Html-pdf
    
    * Https
  
    * Jsonwebtoken
  
    * Nodejs-nodemailer
  
    * Nodemon
  
    * PeerJs
    
    * Socket.io
  
</details>

2. <details><summary>In Front-end</summary> 
  
    * ReactJS
  
    * Material UI
  
    * Axios
  
    * Dateformat
  
    * Jsonwebtoken
  
    * Http
    
    * Jwt-decode
    
    * PeerJs
    
    * Socket.io-client
  
</details>

# Features 🌟

The system serves different type of users (Admins, Patients, and Doctors)

1. <details><summary>As an Admin, you can</summary> 
    
    * View Doctor's Request to join the Platform
    
    * Remove any System user (admin, doctor, or patient)
    
    * Add/Modify health Packages
    
    * Add another Admin to the system.
</details>


2. <details><summary>As a Doctor, you can</summary> 
    
    * View all appointments.
  
    * Search and filter your patients based on the appointment date.
    * Add/View Patient's Health Records
    * View Patient's Medical History
    * Write, modify and donwload pescriptions.
  
    * Add available appointment slots for patients to reserve.
  
    * View Wallet.
  
    * Video Call/Chat with patient.
  
    * Cancel/reschedule appointments.
  
    * Reserve follow-up for the patient.
  
    * Change/Reset Password
    
    * Update information
    * View notifications
  
</details>  

3. <details><summary>As a Patient, you can</summary> 
    
    * Add/View your Family Members
    * Add another patient account as a family member
    
    * View, search, and filter (by available appointment slots and specialty) All Doctors on the System
    
    * Subscribe/Cancel Health Package.
    * Reserve, reschedule, and cancel appointments for yourself and your family members.
    * Request a follow-up.
    * View, download, and order prescriptions.
    * Chat/Video call with your doctors.
    * Upload a Medical History record.
    * Pay for appointments and health packages using wallet/credit card
    * View wallet
    * View notfications
    * Change/Reset Password
</details>

# Code Examples 💽

```javascript
app.post('/remove-patient/:patientId', async (req, res) => {
    const patientId = req.params.patientId;
  
    try {
      await PatientsModel.findByIdAndRemove(patientId);
      res.json({ message: 'Patient removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while removing the patient.' });
    }
  });
```

```javascript
app.get('/doctor-requests', async (req, res) => {
    try {
      const doctorRequests = await DoctorsModel.find({ enrolled: "Pending" });
      res.json(doctorRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
```

```javascript
app.put('/update-doctor-info', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try{
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const existingPatientEmail = await PatientsModel.findOne({ email: req.body.email.toLowerCase() });
    const sameDoctor=await DoctorsModel.findOne({ username: decoded.username });
    const existingDoctorEmail = await DoctorsModel.findOne({ email: req.body.email.toLowerCase() });
    const existingAdminEmail = await AdminsModel.findOne({ email: req.body.email.toLowerCase() });
    if (existingPatientEmail || (existingDoctorEmail&&(sameDoctor._id.toString()!=existingDoctorEmail._id.toString())) || existingAdminEmail) {
      return res.status(400).json({ message: 'Email Associated with Another Account' });
    }
  
    await DoctorsModel.updateOne({ username: decoded.username }, req.body);
    return res.json({ message: 'Doctor info updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating doctor info.' });
  }
});
```

```javascript
app.put("/update-family-member",async (req,res)=>{
  const{name, nationalID, age, gender, relation}=req.body;
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try{
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    await PatientsModel.updateOne({username:decoded.username},{$push: {familyMembers: {nationalID: nationalID, age:age, name:name, gender:gender, relation:relation}}});
    res.json({message:"Family Member info added successfully."});

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured while updating family members."});
  }});

```

```javascript
app.get('/patientsAppointments', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), "random");
    
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const appointments = await AppointmentsModel.find({ patient: patient._id });

    // Create an array to store enhanced appointment information
    const enhancedAppointments = [];

    // Loop through the appointments and retrieve additional information
    for (const appointment of appointments) {
      // Find the doctor using the doctor's ID in the appointment
      const doctor = await DoctorsModel.findOne({ _id: appointment.doctor });

      if (doctor&&appointment.familyMember==null) {
        // Enhance the appointment object with doctor's name
        const enhancedAppointment = {
          _id: appointment._id,
          date: appointment.date,
          status: appointment.status,
          doctorName: doctor.name,
        };
        enhancedAppointments.push(enhancedAppointment);
      } else  if (doctor) {
        // Enhance the appointment object with doctor's name
        const enhancedAppointment = {
          _id: appointment._id,
          date: appointment.date,
          status: appointment.status,
          doctorName: doctor.name,
          familyMember: appointment.familyMember
        };
        enhancedAppointments.push(enhancedAppointment);
      } else {
        // Handle the case where the doctor is not found
        console.error('Doctor not found for appointment ID:', appointment._id);
      }
    }

    res.json(enhancedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while filtering appointments' });
  }
});
```

```javascript
app.post('/wallet-payment', async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
      const { totalPaymentDue } = req.body;

      // Find the patient by username
      const patient = await PatientsModel.findOne({ username: decoded.username});

      if (!patient) {
          return res.status(404).json({ success: false, message: 'Patient not found.' });
      }

      // Check if the patient has enough money in the wallet
      if (patient.wallet < totalPaymentDue) {
          return res.status(400).json({ success: false, message: 'Insufficient funds in the wallet.' });
      }

      // Deduct the amount from the patient's wallet
      patient.wallet -= totalPaymentDue;

      // Save the updated patient
      await patient.save();

      // Return success response
      res.json({ success: true, message: 'Wallet payment successful.' });
  } catch (error) {
      console.error('Error processing wallet payment:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});
```

```javascript
app.post('/verify-otp', (req, res) => {
  const { username, otp } = req.body;
  // Get the stored OTP
  const storedOTP = otpStorage[username];

  if (!storedOTP.toString() || storedOTP.toString() !== otp) {
    res.status(400).json({ message: 'OTP is not correct' });
  } else {
    res.status(200).json({ message: 'OTP verified successfully' });
  }
});
```

```html
<div>
            <Navbar />
            <div style={styles.container}>
                <div ref={messagesContainerRef} style={styles.messageContainer}>
                    {messages.map((message, index) => (
                        <div key={index} style={message.isYourMessage ? styles.yourMessage : styles.otherMessage}>
                            {message.content}
                        </div>
                    ))}
                </div>
                <form style={styles.sendContainer} onSubmit={sendMessage}>
                    <input
                        type="text"
                        id="message-input"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        style={styles.messageInput}
                    />
                    <button type="submit" id="send-button" style={styles.sendButton}>
                        Send
                    </button>
                </form>
            </div>
        </div>
```
# Installation 📩
  * Open two separate terminals.
  * In the first terminal, go to the Backend folder and type the command: `npm install`
      ```bash
      cd server && npm install
      ```
  * In the second terminal, go to the Frontend folder and type the command: `npm install`
      ```bash
      cd virtualClinic && npm install
      ```
      
# API Reference 📋
Here is a list of all the routes available in the project:

- **POST:** `/register-patient`
- **POST:** `/register-doctor`
- **POST:** `/upload-id-document/:username`
- **POST:** `/upload-medical-licenses/:username`
- **POST:** `/upload-medical-degree/:username`
- **GET:** `/getType`
- **POST:** `/login-doctor`
- **POST:** `/login-patient`
- **POST:** `/generate-pdf`
- **POST:** `/login-admin`
- **POST:** `/add-admin`
- **GET:** `/doctor-requests`
- **POST:** `/approve-doctor/:id`
- **POST:** `/reject-doctor/:id`
- **POST:** `/accept-contract`
- **POST:** `/reject-contract`
- **GET:** `/get-admins`
- **POST:** `/remove-admin/:adminId`
- **GET:** `/get-patients`
- **POST:** `/remove-patient/:patientId`
- **GET:** `/get-doctors`
- **POST:** `/remove-doctor/:doctorId`
- **GET:** `/get-my-patients`
- **GET:** `/search-patient/:doctorId/:name`
- **GET:** `/upcoming-appointments/:doctorId`
- **GET:** `/select-patient/:doctorId/:patientId`
- **GET:** `/health-packages`
- **GET:** `/health-packages/:packageId`
- **POST:** `/health-packages`
- **PUT:** `/health-packages/:editingPackageId`
- **DELETE:** `/health-packages/:packageId`
- **GET:** `/get-doctor-info`
- **PUT:** `/update-doctor-info`
- **GET:** `/get-prescriptions/`
- **GET:** `/get-doctor-prescriptions`
- **GET:** `/filter-prescriptions`
- **GET:** `/select-prescriptions/:prescriptionID`
- **PUT:** `/update-family-member`
- **PUT:** `/add-existing-family-member`
- **GET:** `/get-user-gender`
- **GET:** `/get-wallet-value`
- **GET:** `/view-family-members`
- **GET:** `/doctorsAppointments`
- **GET:** `/get-family-member-session-price/:familyMemberId/:doctorId`
- **POST:** `/upload-health-record`
- **GET:** `/patientsAppointments`
- **GET:** `/doctors/:doctorId/patients-info`
- **GET:** `/get-doctors-session-price/`
- **POST:** `/wallet-payment`
- **GET:** `/packages`
- **POST:** `/subscribe`
- **GET:** `/get-my-package`
- **POST:** `/cancel-subscription`
- **GET:** `/get-family-member-package/:id`
- **GET:** `/get-family-member-package-status/:id`
- **POST:** `/cancel-family-subscription/:id`
- **POST:** `/logout`
- **POST:** `/doctors/add-appointments`
- **POST:** `/reserve-family-member`
- **POST:** `/reserve`
- **POST:** `/change-password`
- **POST:** `/send-otp`
- **POST:** `/verify-otp`
- **POST:** `/reset-password`
- **GET:** `/medicalRecords`
- **POST:** `/upload`
- **GET:** `/get-health-records/`
- **GET:** `/uploads/:filename`
- **DELETE:** `/delete/:recordId`
- **POST:** `/follow-up/:appointmentId/:selectedSlot`
- **POST:** `/schedule-follow-up`
- **GET:** `/myDoctors`
- **GET:** `/myPatients`
- **GET:** `/myDoctors`
- **GET:** `/get-family-discount`
- **POST:** `/cancel-appointment/:id`
- **POST:** `/cancel-appointment-doctor/:id`
- **POST:** `/reschedule-appointment`
- **GET:** `/available-slots/:appointmnetId`
- **POST:** `/reschedule-appointment-patient`
- **GET:** `/getRequests`
- **POST:** `/rejectRequest`
- **POST:** `/acceptRequest`
- **POST:** `/add-prescription`
- **GET:** `/getPrescription`
- **GET:** `/getPrescriptionDetails/:prescriptionId`
- **GET:** `/patientName`
- **POST:** `/patientDiscount`
- **PUT:** `/fillPres/:prescriptionId`
- **GET:** `/get-notifications`
- **POST:** `/createRoom`
- **POST:** `/createRoomDoctor`
- **POST:** `/createVideoRoom`
- **POST:** `/createVideoRoomDoctor`

# Tests
![Testing doctor Requests](https://github.com/ACLIENS-ACL/clinic/blob/main/Testing%20doctor%20Requests.png)
![Testing Adding family Members](https://github.com/ACLIENS-ACL/clinic/blob/main/Testing%20Adding%20family%20Members.png)
![Testing health Packages](https://github.com/ACLIENS-ACL/clinic/blob/main/Testing%20health%20Packages.png)

# How to Use
  * Open two separate terminals.
  * In the first terminal, go to the Backend folder and type the command: `npm start`
      ```bash
      cd server && npm start
      ```
  * In the second terminal, go to the Frontend folder and type the command: `npm run dev`
      ```bash
      cd virtualClinic && npm run dev
      ```
      
