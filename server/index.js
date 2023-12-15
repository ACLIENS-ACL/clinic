const axios = require('axios');
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel = require('./models/admins');
const PackagesModel = require('./models/packages');
const AppointmentsModel=require('./models/appointment');
const PrescriptionModel=require('./models/prescriptions');
const NotificationsModel=require('./models/notification');
const RoomsModel=require('./models/rooms');
const videoRoomsModel=require('./models/videoRooms');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { v4: uuidV4 } = require('uuid')

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

const vidIo = require('socket.io')({
  cors: {
    origin: "http://127.0.0.1:5173",  // Replace with your actual frontend origin
    methods: ["GET", "POST"]
  }
}).listen(3004);

vidIo.on('connection', (socket) => {
  console.log('a user connected');

  // Handle signaling messages
  socket.on('signal', (data) => {
    io.to(data.roomId).emit('signal', data);
  });

  // Handle joining a room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



const activeUsers = {};
const activeRooms = {};
const io = require('socket.io')({
  cors: {
    origin: "http://127.0.0.1:5173",  // Replace with your actual frontend origin
    methods: ["GET", "POST"]
  }
}).listen(3003);
io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('new-user', ({ user, userId, roomId }) => {
        // Store the user in the activeUsers object
        activeUsers[userId] = {
            socketId: socket.id,
            name: user,
        };

        // Join the specified room
        socket.join(roomId);
        // Store the room in the activeRooms object
        if (!activeRooms[roomId]) {
            activeRooms[roomId] = [];
        }
        activeRooms[roomId].push(userId);
        // Notify other users in the room that a new user has connected
        socket.to(roomId).emit('user-connected', { name: user, userId, roomId });
      });

    socket.on('send-chat-message', ({ message, userId, roomId }) => {
        // Broadcast the message to all users in the room
        if(activeUsers[userId]){
        socket.to(roomId).emit('chat-message', { name: activeUsers[userId].name, message, userId, roomId });
        }
    });

    socket.on('disconnect', () => {
        const userId = Object.keys(activeUsers).find((key) => activeUsers[key].socketId === socket.id);

        if (userId) {
            const { name, roomId } = activeUsers[userId];

            // Remove the user from activeUsers
            delete activeUsers[userId];

            // Remove the user from the room
            if(activeRooms[roomId]){
            activeRooms[roomId] = activeRooms[roomId].filter((id) => id !== userId);
            }
            // Notify other users in the room that a user has disconnected
            socket.to(roomId).emit('user-disconnected', { name, userId, roomId });
        }

        console.log('A user disconnected');
    });
});

const uploadDirectory = 'uploads';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the folder where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

mongoose.connect('mongodb://localhost:27017/clinic');
//mongoose.connect('mongodb+srv://acliensproject:ACLTest123@cluster0.vt7j6ma.mongodb.net/');

// Create a transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Outlook', 'SendGrid', etc.
  auth: {
    user: 'acliensproject@gmail.com', // Your email address
    pass: 'kbthzovtwwgqgbin', // Your email password
  },
});

// Function to send an email with OTP
const sendOTPByEmail = (toEmail, otp) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Your OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendPatientAppointmentEmail = (toEmail, doctorName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Your Have Reserved An Appointment with Doctor : ${doctorName} on: ${date}`,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendPatientCancelEmail = (toEmail, doctorName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Your Appointment with Doctor : ${doctorName} on: ${date} has been Canceled`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendPatientRescheduleEmail = (toEmail, doctorName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Your Appointment with Doctor : ${doctorName} has been Rescheduled. The appointment is now reserved on: ${date}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendDoctorAppointmentEmail = (toEmail, patientName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Patient: ${patientName} Have Reserved An Appointment with you on: ${date}`,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendDoctorCancelEmail = (toEmail, patientName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Appointment with Patient: ${patientName} on: ${date} has been cancelled`,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

const sendDoctorRescEmail = (toEmail, patientName, date) => {
  const mailOptions = {
    from: 'acliensproject@gmail.com',
    to: toEmail, // User's email address
    subject: 'Appointment Notification',
    text: `Appointment with Patient: ${patientName} has been rescheduled. The appointment is now reserved on: ${date} `,
    
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
    }
  });
};

// Register route for patients and doctors
app.post('/register-patient', async(req, res) => {
  const userData = req.body;
  const existingPatientEmail= await PatientsModel.findOne({ email: userData.email.toLowerCase() })
  const existingDoctorEmail=await DoctorsModel.findOne({ email: userData.email.toLowerCase() })
  const existingAdminEmail=await AdminsModel.findOne({ email: userData.email.toLowerCase() })
  const existingPatientUsername= await PatientsModel.findOne({ username: userData.username.toLowerCase() })
  const existingDoctorUsername=await DoctorsModel.findOne({ email: userData.username.toLowerCase() })
  const existingAdminUsername=await AdminsModel.findOne({ email: userData.username.toLowerCase() })

  if (existingPatientEmail || existingDoctorEmail || existingAdminEmail){
    return res.json({ message: 'An account with the same email already exists' });
  }
  if (userData.username.toLowerCase()=="admin"|| existingPatientUsername||existingDoctorUsername||existingAdminUsername){
    return res.json({ message: 'Username already exists' });
  }
  // Check if a user with the same username already exists in PatientsModel
  PatientsModel.findOne({ username: userData.username.toLowerCase() })
    .then(existingPatient => {
      if (existingPatient) {
        return res.json({ message: 'Username already exists' });
      } else {
        // Check if an account with the same phone number already exists
        PatientsModel.findOne({ mobileNumber: userData.mobileNumber })
          .then(existingPatientByPhone => {
            if (existingPatientByPhone) {
              return res.json({ message: 'An account with the same phone number already exists' });
            } else {
              // Check if an account with the same email already exists
              PatientsModel.findOne({ email: userData.email })
                .then(existingPatientByEmail => {
                  if (existingPatientByEmail) {
                    return res.json({ message: 'An account with the same email already exists' });
                  } else {
                    // If the username, phone number, and email are unique, create the new patient
                    PatientsModel.create(userData)
                      .then(patient => res.json(patient))
                      .catch(err => res.status(400).json(err));
                  }
                })
                .catch(err => res.status(500).json(err));
            }
          })
          .catch(err => res.status(500).json(err));
      }
    })
    .catch(err => res.status(500).json(err));
});


app.post('/register-doctor', async (req, res) => {
  const userData = req.body;
  const existingPatientEmail= await PatientsModel.findOne({ email: userData.email.toLowerCase() })
  const existingDoctorEmail=await DoctorsModel.findOne({ email: userData.email.toLowerCase() })
  const existingAdminEmail=await AdminsModel.findOne({ email: userData.email.toLowerCase() })
  const existingPatientUsername= await PatientsModel.findOne({ username: userData.username.toLowerCase() })
  const existingDoctorUsername=await DoctorsModel.findOne({ email: userData.username.toLowerCase() })
  const existingAdminUsername=await AdminsModel.findOne({ email: userData.username.toLowerCase() })
  if (existingPatientEmail || existingDoctorEmail || existingAdminEmail){
    return res.json({ message: 'An account with the same email already exists' });
  }
  if (userData.username.toLowerCase()=="admin"|| existingPatientUsername||existingDoctorUsername||existingAdminUsername){
    return res.json({ message: 'Username already exists' });
  }
  // Check if a user with the same username already exists in DoctorsModel
  DoctorsModel.findOne({ username: userData.username })
    .then(existingDoctor => {
      if (existingDoctor) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        // If the username is unique, create the new doctor
        DoctorsModel.create(userData)
          .then(res.json({ message: 'completed' }))
          .catch(err => res.status(400).json(err));
        
      }
    })
    .catch(err => res.status(500).json(err));
});
app.post('/upload-id-document/:username', upload.single('idDocument'), (req, res) => {
  const username = req.params.username;
  const idDocument = req.file;
  // Check if a patient with the given username exists in the PatientsModel
  DoctorsModel.findOne({ username: username })
    .then(existingPatient => {
      if (!existingPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Update the ID document information for the patient
      existingPatient.idDocument = {
        fileName: idDocument ? idDocument.filename : '',
        filePath: idDocument ? idDocument.path : '',
      };
      // Save the updated patient information to the database
      existingPatient.save()
        .then(updatedPatient => res.json(updatedPatient))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

app.post('/upload-medical-licenses/:username', upload.single('medicalLicenses'), (req, res) => {
  const username = req.params.username;
  const medicalLicenses = req.file;

  // Check if a doctor with the given username exists in the DoctorsModel
  DoctorsModel.findOne({ username: username })
    .then(existingDoctor => {
      if (!existingDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      existingDoctor.medicalLicenses.push({
        fileName: medicalLicenses ? medicalLicenses.filename : '',
        filePath: medicalLicenses ? medicalLicenses.path : '',
      });

      // Save the updated doctor information to the database
      existingDoctor.save()
        .then(updatedDoctor => res.json(updatedDoctor))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});


app.post('/upload-medical-degree/:username', upload.single('medicalDegree'), (req, res) => {
  const username = req.params.username;
  const medicalDegree = req.file;
  
  // Check if a patient with the given username exists in the PatientsModel
  DoctorsModel.findOne({ username: username })
    .then(existingPatient => {
      if (!existingPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      // Update the ID document information for the patient
      existingPatient.medicalDegree = {
        fileName: medicalDegree ? medicalDegree.filename : '',
        filePath: medicalDegree ? medicalDegree.path : '',
      };
      // Save the updated patient information to the database
      existingPatient.save()
        .then(updatedPatient => res.json(updatedPatient))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});
app.get('/getType', async (req, res) => {
  const { username } = req.query;
  if(username.toLowerCase()=="admin"){
    return res.json({ userType: 'admin' });
  }
  try {
    // Check in DoctorsModel
    const doctor = await DoctorsModel.findOne({ username });
    if (doctor) {
      return res.json({ userType: 'doctor' });
    }
    // Check in PatientsModel
    const patient = await PatientsModel.findOne({ username });
    if (patient) {
      
      return res.json({ userType: 'patient' });
    }
    // Check in AdminsModel
    const admin = await AdminsModel.findOne({ username });
    if (admin) {
      return res.json({ userType: 'admin' });
    }
    // If username is not found in any model, return an appropriate response
    return res.json({ userType: 'not found' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login-doctor', (req, res) => {
  const { username, password } = req.body;
 
  DoctorsModel.findOne({ username: username.toLowerCase() })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign({ username: user.username, type: 'doctor' }, 'random');
          if (user.enrolled === "Pending" || user.enrolled === "Request Not Made") {
            const token2 = jwt.sign({ username: user.username, type: 'doctornotreg' }, 'random');
            res.json({ message: "Success But Not Enrolled", enrolledStatus: user.enrolled, token2 });
          } else if(user.enrolled === "PendingContract") {
            res.json({ message: "Waiting for contract", token });
          }
          else{
            res.json({ message: 'Success', token });
          }
        } else {
          res.status(401).json({ message: "Password incorrect" });
        }
      } else {
        
        res.status(404).json({ message: "Username isn't registered" });
      }
    })
    .catch((err) => res.status(400).json(err));
});

  app.post('/login-patient', (req, res) => {
    const {username, password} = req.body;
    PatientsModel.findOne({ username: username.toLowerCase() })
        .then(user => {
          if (user) {
            if (user.password === password) {
              const token = jwt.sign({ username: user.username, type: 'patient' }, 'random');
              res.json({ message: 'Success', token });
            } else {
              res.json({message:"Password incorrect"});
            }
          } else {
            res.json({message: "username isn't registered"});
          }
        })
        .catch(err => res.status(400).json(err));
  });
  const pdf = require('html-pdf');
  app.post('/generate-pdf', (req, res) => {
    const { prescription, appointmentId } = req.body;
  
    // Generate HTML from prescription data
    const html = generateHtmlFromPrescription(prescription);
  
    const options = { format: 'Letter' };
  
    pdf.create(html, options).toFile(path.join(uploadDirectory, `${appointmentId}.pdf`), (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error generating PDF' });
      } else {
        res.json({ success: true, filePath: result.filename });
      }
    });
  });
  
  function generateHtmlFromPrescription(prescription) {
    // Customize this function to create the HTML structure based on your prescription data
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prescription</title>
      </head>
      <body>
        <h1>Prescription</h1>
        <ul>
          ${prescription.map(item => `
            <li>
              ${item.name} - Dosage: ${item.dosage.timesDaily} times daily for ${item.dosage.numberOfDays} day(s)
            </li>
          `).join('')}
        </ul>
      </body>
      </html>
    `;
  }

  app.post('/login-admin', (req, res) => {
    const {username, password} = req.body;
    if(username.toLowerCase()==="admin"&&password=="admin"){
      const token = jwt.sign({ username: "admin", type: 'admin' }, 'random');
      res.json({ message: 'Success', token });
        
      }
    
    else{
        AdminsModel.findOne({ username: username.toLowerCase() })
        .then(user => {
          if (user) {
            if (user.password === password) {
              const token = jwt.sign({ username: user.username, type: 'admin' }, 'random');
              res.json({ message: 'Success', token });
            } else {
              res.json("Password incorrect");
            }
          } else {
            res.json("Username isn't registered");
          }
        })
  }});


  app.post('/add-admin', async (req, res) => {
  try {
    const adminData = req.body;
   
    const existingPatientEmail= await PatientsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingDoctorEmail=await DoctorsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingAdminEmail=await AdminsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingPatientUsername= await PatientsModel.findOne({ username: adminData.username.toLowerCase() })
  const existingDoctorUsername=await DoctorsModel.findOne({ email: adminData.username.toLowerCase() })
  const existingAdminUsername=await AdminsModel.findOne({ email: adminData.username.toLowerCase() })
  if (existingPatientEmail || existingDoctorEmail || existingAdminEmail){
    return res.json({ message: 'Email Associated With an Existing Account' });
  }
  else if(
    existingPatientUsername||existingDoctorUsername||existingAdminUsername
  ){
    return res.json({ message: 'Username Associated With an Existing Account' });
  }
    if ((req.body.username.toLowerCase()=="admin")) {
      // If username already exists, return an error response
      return res.json({ message: 'Username already exists' });
    }

    // If username doesn't exist, create a new admin
    const newAdmin = new AdminsModel(adminData);

    // Save the new admin to the admins collection
    await newAdmin.save();

    // Return a success response
    res.json({ message: 'Admin added successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.json({ message: 'Internal server error' });
  }
});

// Server-side route to fetch doctor requests
app.get('/doctor-requests', async (req, res) => {
    try {
      const doctorRequests = await DoctorsModel.find({ enrolled: "Pending" });
      res.json(doctorRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Server-side route to approve a doctor
app.post('/approve-doctor/:id', async (req, res) => {
    try {
      const doctorId = req.params.id;
  
      // Update the doctor's "enrolled" status to true
      await DoctorsModel.findByIdAndUpdate(doctorId, { enrolled: "PendingContract" });
  
      res.json({ message: 'Doctor approved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Server-side route to reject and remove a doctor
  app.post('/reject-doctor/:id', async (req, res) => {
    try {
      const doctorId = req.params.id;
  
      await DoctorsModel.deleteOne({ _id: doctorId });
  
      res.json({ message: 'Doctor Rejected Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/accept-contract', async (req, res) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  
      // Check if the user is a doctor
      if (decoded.type !== 'doctor') {
        return res.status(403).json({ message: 'Forbidden, not a doctor' });
      }
  
      // Update the doctor's enrollment status
      await DoctorsModel.findOneAndUpdate({ username: decoded.username }, { enrolled: 'Approved' });
      
      res.json({ message: 'Doctor approved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/reject-contract', async (req, res) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  
      // Check if the user is a doctor
      if (decoded.type !== 'doctor') {
        return res.status(403).json({ message: 'Forbidden, not a doctor' });
      }
  
      // Delete the doctor's record
      await DoctorsModel.deleteOne({ username: decoded.username });
      
      res.json({ message: 'Doctor Rejected Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/get-admins', async (req, res) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
      const admins = await AdminsModel.find({ username: { $ne: decoded.username } });
      res.json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching admins.' });
    }
  });
  // POST endpoint to remove an admin by ID
  app.post('/remove-admin/:adminId', async (req, res) => {
    const adminId = req.params.adminId;
  
    try {
      await AdminsModel.findByIdAndRemove(adminId);
      res.json({ message: 'Admin removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while removing the admin.' });
    }
  });

  app.get('/get-patients', async (req, res) => {
    try {
      const patients = await PatientsModel.find();
      res.json(patients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching patients.' });
    }
  });
  
  // POST endpoint to remove a patient by ID
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
// GET endpoint to fetch all doctors
app.get('/get-doctors', async (req, res) => {
  try {
    const doctors = await DoctorsModel.find({enrolled:'Approved'});
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching doctors.' });
  }
});

app.post('/remove-doctor/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    await DoctorsModel.findByIdAndRemove(doctorId);
    res.json({ message: 'Doctor removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while removing the doctor.' });
  }
});

app.get('/get-my-patients', async (req, res) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    // Find the doctor based on the logged-in username
    const doctor = await DoctorsModel.findOne({ username: decoded.username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find all appointments for the doctor
    const appointments = await AppointmentsModel.find({ doctor: doctor._id, cancelled: 'false' });

    // Extract unique patient IDs from the appointments
    const patientIds = Array.from(new Set(appointments.map(appointment => appointment.patient)));

    // Find the patient details for each patient ID
    const patients = await PatientsModel.find({ _id: { $in: patientIds } });

    // Create a new array with 'info' objects
    const patientInfo = appointments.map(appointment => {
      const patient = patients.find(p => p._id.equals(appointment.patient));
      const familyMember = appointment.familyMember;
      if (familyMember) {
        const foundFamilyMember = patient.familyMembers.find(member => member.name === familyMember.name);
        // Return family member info only
        return {
          info: {
            _id: patient._id,
            name:patient.name,
            familyMemberName: familyMember.name,
            age: familyMember.age,
            gender: familyMember.gender,
            account:familyMember.account,
            healthRecords: foundFamilyMember.healthRecords,
            date: appointment.date,
            
          },
        };
      } else {
        // Return patient info
        return {
          info: {
            _id: patient._id,
            name: patient.name,
            email: patient.email,
            dob: patient.dob,
            gender: patient.gender,
            mobileNumber: patient.mobileNumber,
            emergencyContactName: patient.emergencyContactName,
            emergencyContactNumber: patient.emergencyContactNumber,
            healthRecords: patient.healthRecords,
            medicalHistory: patient.medicalHistory,
            date: appointment.date,
          },
        };
      }
    });
    res.json(patientInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// the doctor search for the patient by his name (req 34)
app.get('/search-patient/:doctorId/:name', async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(404).json({error:'Invalid ID'});
  }
  const name = req.params.name;
  const patients = await PatientsModel.find({ doctorId: doctorId, name: name });
  res.json(patients);
});
// filter patients based on upcoming appointments(req 35)
app.get('/upcoming-appointments/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(404).json({error:'Invalid ID'});
  }
  const patients = await PatientsModel.find({ doctorId: doctorId });
  const upcomingAppointments = patients.filter(patient => patient.appointments[0].date > Date.now());
  upcomingAppointments.sort((a, b) => a.appointments[0].date - b.appointments[0].date);
  res.json(upcomingAppointments);
});
//select patient from list of patients(req 36)
app.get('/select-patient/:doctorId/:patientId', async (req, res) => {
  const doctorId = req.params.doctorId;
  const patientId = req.params.patientId;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(404).json({error:'Invalid ID'});
  }
  const patient = await PatientsModel.findOne({ doctorId: doctorId, _id: patientId });

  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(404).json({error:'Invalid ID'});
  }

  res.json(patient);

}); 
  
  
app.get('/health-packages', async (req, res) => {
  try {
    const packages = await PackagesModel.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve a specific health package by ID
app.get('/health-packages/:packageId', async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const package = await PackagesModel.findById(packageId);
    if (!package) {
      res.status(404).json({ error: 'Package not found' });
    } else {
      res.json(package);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new health package
app.post('/health-packages', async (req, res) => {
  try {
    const newPackage = new PackagesModel(req.body);
    await newPackage.save();
    const packages = await PackagesModel.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing health package by ID
app.put('/health-packages/:editingPackageId', async (req, res) => {
  try {
    const editingPackageId = req.params.editingPackageId;
    const updatedPackage = await PackagesModel.findByIdAndUpdate(
      editingPackageId,
      req.body,
      { new: true }
    );
    if (!updatedPackage) {
      res.status(404).json({ error: 'Package not found' });
    } else {
      const packages = await PackagesModel.find();
      res.json(packages);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a health package by ID
app.delete('/health-packages/:packageId', async (req, res) => {
  try {
    const packageId = req.params.packageId;
    await PackagesModel.findByIdAndDelete(packageId);
    const packages = await PackagesModel.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-doctor-info', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try{
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const doctorInfo = await DoctorsModel.findOne({ username: decoded.username });
    res.json(doctorInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching doctor info.' });
  }
});

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


//view a list of all my Prescriptions   (Req 54)

app.get('/get-prescriptions/', async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    // Find the patient with the given username
     // Replace with the actual logged username
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find prescriptions for the patient
    const prescriptions = await PrescriptionModel
      .find({ patientID: patient._id })
      .populate({
        path: 'doctorID',
        select: 'name', // Select the doctor's name
        model: DoctorsModel,
      });
      
    // Process the prescriptions to add the 'status' field
    const updatedPrescriptions = await prescriptions.map((prescription) => {
      return {
        _id:prescription._id,
        medicines: prescription.medicines,
        doctorName: prescription.doctorID.name,
        date: prescription.date,
        filled: prescription.filled,
        fileName:prescription.fileName,
        patientName: patient.name
      };
    });
    res.json(updatedPrescriptions);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/get-doctor-prescriptions', async (req, res) => {
  try {
    
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    // Find the patient with the given username
     // Replace with the actual logged username
    const doctor = await DoctorsModel.findOne({ username: decoded.username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find prescriptions for the patient
    const prescriptions = await PrescriptionModel
      .find({ doctorID: doctor._id })
      .populate({
        path: 'patientID',
        select: 'name', // Select the doctor's name
        model: PatientsModel,
      });
      
    // Process the prescriptions to add the 'status' field
    const updatedPrescriptions = prescriptions.map((prescription) => {
      return {
        medicines: prescription.medicines,
        doctorName: prescription.doctorID.name,
        date: prescription.date,
        filled: prescription.filled,
        fileName:prescription.fileName,
        patientName: prescription.patientID.name
      };
    });
    res.json(updatedPrescriptions);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//filter prescriptions based on date or doctor or filled or unfilled   (Req 55)

app.get('/filter-prescriptions', async (req, res) => {
    try {
      let query = {};

      if (req.query.startDate && req.query.endDate ) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        if (endDate < startDate) {
          return res.status(400).json({ message: 'endDate must be greater than or equal to startDate' });
        }
        query.Date = {
          $gte: startDate,
          $lte: endDate
        };
      } else if (req.query.date) {
        // Use this block if you want to filter by a single date
        query.Date = new Date(req.query.date);
      }

      if (req.query.doctorID) {
        query.doctorID = req.query.doctorID;
      }

      if (req.query.status) {
        query.Status = req.query.status;
      }

      const prescriptions = await PrescriptionModel.find(query);
      res.json(prescriptions);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//select a prescription from my list of perscriptions (REQ 56)
app.get('/select-prescriptions/:prescriptionID', async (req, res) => {
  try {
    const prescriptionID = req.params.prescriptionID;
    const prescription = await PrescriptionModel.findById(prescriptionID);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json({prescription});
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
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

app.put("/add-existing-family-member",async (req,res)=>{
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  const{email, phone, relation}=req.body;
  const user=await PatientsModel.findOne({username:decoded.username});

  if(email==user.email||phone==user.mobileNumber){
    return res.status(404).json({ message: 'You cannot add your own account!' });
  }
  let patient;
  try{
    if(email){
      patient=await PatientsModel.findOne({email:email});
    }
    else{
      patient=await PatientsModel.findOne({mobileNumber:phone});
    }
    if(!patient){
      return res.status(404).json({ message: 'Patient Not found' });
    }
    const info={
      account:patient._id,
      name:patient.name,
      nationalID:patient.nationalID,
      gender:patient.gender,
      age: (new Date()).getFullYear() - patient.dob.getFullYear(),
      relation:relation.toLowerCase()
    }
    const existingFamilyMember = user.familyMembers.find(member =>
      member.name === info.name &&
      member.nationalID === info.nationalID 
    );
    
    if (existingFamilyMember) {
      // Family member already exists, handle the error
      res.status(400).json({message:"Family Member Already exists"});

    } else {
      // Add the family member to the user's familyMembers array
      user.familyMembers.push(info);
      user.save();
      res.status(200).json({message:"Family Member Has Been Added!"});
    }
    let relation2;
    if(relation.toLowerCase()==="husband"){
      relation2="wife"
    }
    if(relation.toLowerCase()==="wife"){
      relation2="husband"
    }
    if(relation2){
    const info2={
      account:user._id,
      name:user.name,
      nationalID:user.nationalID,
      age: (new Date()).getFullYear() - user.dob.getFullYear(),
      relation:relation2.toLowerCase(),
    }

    patient.familyMembers.push(info2);
    patient.save();
  }
  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured while updating family members."});
  }});

app.get('/get-user-gender', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 

    const userType = decoded.type;
    const username = decoded.username;

    let model;

    if (userType === 'patient') {
      model = PatientsModel;
    } else if (userType === 'doctor') {
      model = DoctorsModel;
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    model.findOne({ username: username })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ gender: user.gender });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

  app.get('/get-wallet-value', (req, res) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), "random");
  
      // Assuming you have the user type and username in the token payload
      const userType = decoded.type;
      const username = decoded.username;
  
      let model;
  
      if (userType === 'patient') {
        model = PatientsModel;
      } else if (userType === 'doctor') {
        model = DoctorsModel;
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }
  
      model.findOne({ username: username })
        .then(user => {
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          res.json({ walletValue: user.wallet });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
  // view family memebers
  app.get('/view-family-members', async (req, res) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  
      const patient = await PatientsModel.findOne({ username: decoded.username });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const familyMembers = patient.familyMembers;
  
      res.json(familyMembers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching family members' });
    }
  });
  
  

// filter appointments by date/status for doc
app.get('/doctorsAppointments', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), "random");
    const doctor = await DoctorsModel.findOne({ username: decoded.username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointments = await AppointmentsModel.find({ doctor: doctor._id });

    // Create an array to store enhanced appointment information
    const enhancedAppointments = [];

    // Loop through the appointments and retrieve additional information
    for (const appointment of appointments) {
      if(appointment.familyMember==null){
      // Find the doctor using the doctor's ID in the appointment
      const patient = await PatientsModel.findOne({ _id: appointment.patient });

      if (patient) {
        // Enhance the appointment object with doctor's name
        const enhancedAppointment = {
          _id: appointment._id,
          date: appointment.date,
          status: appointment.status,
          patientName: patient.name,
          followedUp:appointment.followedUp,
          prescribed:appointment.prescribed
        };
        enhancedAppointments.push(enhancedAppointment);
      }
      } else if(appointment.familyMember.account==null){
        // Find the doctor using the doctor's ID in the appointment
        const patient = await PatientsModel.findOne({ _id: appointment.patient });
  
        if (patient) {
          // Enhance the appointment object with doctor's name
          const enhancedAppointment = {
            _id: appointment._id,
            date: appointment.date,
            status: appointment.status,
            patientName: patient.name,
            familyMember:appointment.familyMember,
            followedUp:appointment.followedUp,
            prescribed:appointment.prescribed
          };
          enhancedAppointments.push(enhancedAppointment);
        }
      }
    }

    res.json(enhancedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while filtering appointments' });
  }
});

app.get('/get-family-member-session-price/:familyMemberId/:doctorId', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const familyMemberId = req.params.familyMemberId;
    const doctorId = req.params.doctorId;

    // Fetch patient details based on the username
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Fetch family member details based on the ID
    const familyMember = patient.familyMembers.find((member) => member._id.toString() === familyMemberId);

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    // Fetch doctor details based on the ID
    const doctor = await DoctorsModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    let sessionPrice;

    if (!familyMember.subscribedPackage) {
      // If the family member does not have a subscribed package, use the doctor's hourly rate
      sessionPrice = doctor.hourlyRate*1.1;
    } else {
      // If the family member has a subscribed package, calculate the discounted session price
      const package = await PackagesModel.findById(familyMember.subscribedPackage);

      if (!package) {
        return res.status(404).json({ message: 'Package not found' });
      }

      const discount = package.doctorSessionDiscount || 0; // Assuming doctorSessionDiscount is an attribute of the package
      sessionPrice = doctor.hourlyRate*1.1- doctor.hourlyRate* (discount/100);
    }

    res.status(200).json( sessionPrice );
  } catch (error) {
    console.error('Error fetching family member session price:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/upload-health-record', upload.single('recordFile'), async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const familyMember=req.body.familyMember;
    const filePath = req.file.path;
    if(familyMember){
      const patient = await PatientsModel.findById(patientId);
      const foundFamilyMember = patient.familyMembers.find(member => member.name === familyMember);

      if (foundFamilyMember) {
        // Push the filePath to the healthRecords of the found family member
        foundFamilyMember.healthRecords.push(filePath);
        
        // Save the changes to the patient
        await patient.save();
  
        return res.status(200).json({ message: 'Health record added successfully' });
    }
  }
    // Update the patient's healthRecords array with the new file path
    const patient = await PatientsModel.findByIdAndUpdate(
      patientId,
      { $push: { healthRecords: filePath } },
      { new: true }
    );

    res.json({ success: true, message: 'Health record uploaded successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// filter appointments by date/status for patient
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


// view info of patients registered with a doc
app.get('/doctors/:doctorId/patients-info', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await DoctorsModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const patients = await PatientsModel.find({ doctorId });
    const patientInfo = patients.map((patient) => {
      return {
        name: patient.name,
        healthRecords: patient.healthRecords,
        mail:patient.mail,
        gender:patient.gender,
        mobile: patient.mobileNumber,
      };
    });
    res.json(patientInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching patient information and health records' });
  }
});
app.get('/get-doctors-session-price/', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    const doctors = await DoctorsModel.find({enrolled:'Approved'});

    const patient = await PatientsModel.findOne({ username: decoded.username });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const subPackage = await PackagesModel.findById(patient.subscribedPackage);

    if (subPackage) {
      const discount = subPackage.doctorSessionDiscount;

      for (let i = 0; i < doctors.length; i++) {
        doctors[i].hourlyRate = doctors[i].hourlyRate*1.1 -  ( discount / 100)*doctors[i].hourlyRate;
      }
    } else {
      for (let i = 0; i < doctors.length; i++) {
        doctors[i].hourlyRate = doctors[i].hourlyRate * 1.1;
      }
    }
    res.json(doctors);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

app.get('/packages', async (req, res) => {
  try {
    const packages = await PackagesModel.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/subscribe', async (req, res) => {
  const { self, packageId, familyMembers } = req.body;
  try {
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    // Update the user's subscription
    if(self!="false"){
    await PatientsModel.findOneAndUpdate(
      { username: decoded.username },
      { subscribedPackage: packageId, subscriptionDate: new Date(), canceled: null}
    );
    }
    const user = await PatientsModel.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const members = user.familyMembers;

    async function updateMembers() {
      for (const member of familyMembers) {
        for (const patientMem of members) {
          if (patientMem.name === member) {
            if (patientMem.account) {
              await PatientsModel.findOneAndUpdate(
                { _id: patientMem.account },
                { subscribedPackage: packageId, subscriptionDate: new Date(), canceled: null }
              );
            }
            patientMem.subscribedPackage = packageId;
            patientMem.subscriptionDate = new Date();
            patientMem.canceled = null;
          }
        }
      }
    }
    await updateMembers();
    const fam = await PatientsModel.findOneAndUpdate(
      { username: decoded.username },
      { familyMembers: members }
    );

    if (!fam) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Subscription failed' });
  }
});

app.get('/get-my-package', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Fetch patient details based on the username from the token
    const user = await PatientsModel.findOne({ username: decoded.username });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const result = new Object();
    const package = await PackagesModel.findOne({ _id: user.subscribedPackage });

    result.package = package;
    result.subscribedDate = user.subscriptionDate;
    result.canceled = user.canceled;

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cancel-subscription', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Update the user's subscription cancellation date
    await PatientsModel.findOneAndUpdate({ username: decoded.username }, { canceled: new Date() });

    res.status(200).json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/get-family-member-package/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
      // Query the PackagesModel to find the family member's package
      const package = await PackagesModel.findOne({ _id: memberId });
      if (package) {
          res.json(package);
      } else {
          res.status(404).json({ error: 'Family member not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});
app.get('/get-family-member-package-status/:id', async (req, res) => {
  try {
    const memberId = req.params.id;

    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Query the PackagesModel to find the family member's package status
    const patient = await PatientsModel.findOne({ username: decoded.username });
    const familyMember = patient.familyMembers.find((member) => member._id.equals(memberId));

    if (!familyMember) {
      return res.status(404).json({ error: 'Family member not found for the given memberID' });
    }

    res.json({
      canceled: familyMember.canceled,
      subscriptionDate: familyMember.subscriptionDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/cancel-family-subscription/:id', async (req, res) => {
  try {
    const memberId = req.params.id;

    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Query the PatientsModel to find the family member's package
    const patient = await PatientsModel.findOne({ username: decoded.username });
    const familyMember = patient.familyMembers.find((member) => member._id.equals(memberId));

    if (familyMember) {
      // Update the familyMember's 'canceled' field with the current date
      familyMember.canceled = new Date();

      // Save the changes to the database
      await patient.save();

      res.status(200).json({ message: 'Subscription canceled successfully' });
    } else {
      res.status(404).json({ error: 'Family member not found for the given memberID' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    
    // Respond with a success message
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/doctors/add-appointments', async (req, res) => {
  const { appointments } = req.body;

  try {
    // Get the token from the authorization header
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract the username from the token
    const username = jwt.verify(token.replace('Bearer ', ''), 'random').username;

    // Find the doctor by username
    const doctor = await DoctorsModel.findOne({ username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Add the appointments to the doctor's appointment list
    doctor.availableSlots.push(...appointments);

    // Save the updated doctor object
    await doctor.save();

    res.status(200).json({ message: 'Appointments added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/reserve-family-member', async (req, res) => {
  const { doctorId, dateTime , familyMemberId, totalPaymentDue} = req.body;
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    // Retrieve patient ID based on username
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const ObjectId = mongoose.Types.ObjectId;
    const familyMember = patient.familyMembers.find(member => member._id.toString() === new ObjectId(familyMemberId).toString());
    if (!familyMember) {
      return res.status(404).json({ message: 'familyMember not found' });
    }
    const data={
      account: familyMember.account,
      name: familyMember.name,
      nationalID: familyMember.nationalID,
      age: familyMember.age,
      gender: familyMember.gender,
      relation: familyMember.relation,
      healthRecords:familyMember.healthRecords,
    };
    if(familyMember.account){
      const tempAppoitnment = new AppointmentsModel({
        doctor: doctorId,
        patient: familyMember.account, // Assign the patient's ID
        date: dateTime,
        cost: totalPaymentDue,
      });
      tempAppoitnment.save();
    }
    // Create a new appointment in AppointmentsModel
    const newAppointment = new AppointmentsModel({
      doctor: doctorId,
      patient: patient._id, // Assign the patient's ID
      date: dateTime,
      familyMember: data,
      cost: totalPaymentDue,
    });

    // Remove the reserved dateTime from the doctor's availableSlots
    const doctor = await DoctorsModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const value=doctor.wallet+totalPaymentDue*0.9;
    await DoctorsModel.updateOne(
      { _id: doctorId },
      {
        $pull: { availableSlots: dateTime },
        wallet:value
      }
    );
    sendPatientAppointmentEmail(patient.email,doctor.name, dateTime.toLocaleString());
    sendDoctorAppointmentEmail(doctor.email,patient.name, dateTime.toLocaleString());
    const newNotification = new NotificationsModel({
      patient: patient._id, // Replace with a valid patient ID
      doctor: doctor._id,   // Replace with a valid doctor ID
      date: dateTime,           // Replace with the desired date=
    });
    // Save the new Notification object to the database
    newNotification.save();
    await newAppointment.save();
    await doctor.save();

    res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reserve appointment' });
  }
});
app.post('/reserve', async (req, res) => {
  const { doctorId, dateTime, totalPaymentDue } = req.body;

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    
    // Retrieve patient ID based on username
    const patient = await PatientsModel.findOne({ username: decoded.username });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new appointment in AppointmentsModel
    const newAppointment = new AppointmentsModel({
      doctor: doctorId,
      patient: patient._id, // Assign the patient's ID
      date: dateTime,
      cost: totalPaymentDue
    });

    // Remove the reserved dateTime from the doctor's availableSlots
    const doctor = await DoctorsModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const value=doctor.wallet+totalPaymentDue*0.9;
    const Doctor=await DoctorsModel.findOne({ _id: doctorId });
    await DoctorsModel.updateOne(
      { _id: doctorId },
      {
        $pull: { availableSlots: dateTime },
        wallet:value
      }
    );
    sendPatientAppointmentEmail(patient.email,Doctor.name, dateTime.toLocaleString());
    sendDoctorAppointmentEmail(Doctor.email,patient.name, dateTime.toLocaleString());
    await newAppointment.save();
    await doctor.save();
    const newNotification = new NotificationsModel({
      patient: patient._id, // Replace with a valid patient ID
      doctor: Doctor._id,   // Replace with a valid doctor ID
      date: dateTime,           // Replace with the desired date=
    });
    // Save the new Notification object to the database
    newNotification.save();
    res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reserve appointment' });
  }
});
app.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Retrieve the token from the request headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 

    // Access the appropriate model based on user type
    let user;

    if (decoded.type === 'admin') {
      user = await AdminsModel.findOne({ username: decoded.username });
    } else if (decoded.type === 'patient') {
      user = await PatientsModel.findOne({ username: decoded.username });
    } else if (decoded.type === 'doctor') {
      user = await DoctorsModel.findOne({ username: decoded.username });
    }

    if (!user) {
      return res.status(404).json({ message: 'Username does not exist' });
    }

    if (currentPassword !== user.password) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

const otpStorage = {};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

app.post('/send-otp', async (req, res) => {
  const { username } = req.body;
  const userNameLowered=username.toLowerCase();
  let email;
  let userType;
  let userModel;
  if (username) {
    const patient = await PatientsModel.findOne({ username: userNameLowered });
    if (patient) {
      email = patient.email;
      userType = 'patient';
      userModel = PatientsModel;
    } else {
      const admin = await AdminsModel.findOne({ username: userNameLowered });
      if (admin) {
        email = admin.email;
        userType = 'admin';
        userModel = AdminsModel;
      } else {
        const doctor = await DoctorsModel.findOne({ username: userNameLowered });
        if (doctor) {
          email = doctor.email;
          userType = 'doctor';
          userModel = DoctorsModel;
        }
      }
    }
  }

  if (!email) {
    return res.status(404).json({ message: 'Username does not exist!' });
  }

  // Generate an OTP and store it
  const otp = generateOTP();
  otpStorage[username] = otp;
  sendOTPByEmail(email, otp);
  // Send the OTP to the user's email (you'll need to implement this)
  // For this example, we're just sending it back as a response
  res.status(200).json({ otp });
});

// Endpoint to verify OTP
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

// Endpoint to reset the password
app.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;
  if (username) {
    const patient = await PatientsModel.findOne({ username });
    if (patient) {
       await PatientsModel.findOneAndUpdate({ username}, {password:newPassword });
    } else {
      const admin = await AdminsModel.findOne({ username });
      if (admin) {
        await AdminsModel.findOneAndUpdate({ username}, {password:newPassword });
      } else {
        const doctor = await DoctorsModel.findOne({ username });
        if (doctor) {
          await DoctorsModel.findOneAndUpdate({ username}, {password:newPassword });
        }
      }
    }
  }
  res.status(200).json({ message: 'Password reset successfully' });
});

app.get('/medicalRecords', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Fetch patient details based on the username from the token
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(200).json(patient.medicalHistory);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const filePath = req.file.path;
    const fileName = req.file.originalname; 
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if the patient has the medicalRecords array; if not, create it.
    if (!patient.medicalHistory) {
      patient.medicalHistory = [];
    }

    patient.medicalHistory.push({ fileName,filePath });
    await patient.save();
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/get-health-records/', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    // Fetch health records for the specific patient using the decoded username
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json(patient.healthRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename); // Adjust the directory as needed

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});

app.delete('/delete/:recordId', async (req, res) => {
  try {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify and decode the token to get the username
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const { recordId } = req.params;
    const patient = await PatientsModel.findOne({ username: decoded.username }).exec();

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Find the index of the record with the specified recordId
    const recordIndex = patient.medicalHistory.findIndex((record) => record._id.toString() === recordId);

    if (recordIndex === -1) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Remove the record at the specified index
    patient.medicalHistory.splice(recordIndex, 1);

    await patient.save();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/follow-up/:appointmentId/:selectedSlot', async (req, res) => {
  const { appointmentId, selectedSlot } = req.params;
  try {
    // Find the original appointment
    const originalAppointment = await AppointmentsModel.findById(appointmentId);

    if (!originalAppointment) {
      return res.status(404).json({ message: 'Original appointment not found' });
    }
    const updatedDoctor = await DoctorsModel.findOneAndUpdate(
      { _id: originalAppointment.doctor },
      { $pull: { availableSlots: selectedSlot } }
    );
    updatedDoctor.save();
    // Create a new follow-up appointment
    const followUpAppointment = new AppointmentsModel({
      date: new Date(selectedSlot),
      patient: originalAppointment.patient,
      doctor: originalAppointment.doctor,
      familyMember:originalAppointment.familyMember,
      type: "request"
    });

    // Save the follow-up appointment to the database
    await followUpAppointment.save();

    return res.status(200).json({ message: 'Follow-up appointment scheduled successfully', followUpAppointment });
  } catch (error) {
    console.error('Error scheduling follow-up:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint for scheduling a follow-up
app.post('/schedule-follow-up', async (req, res) => {

  try {
    const { originalAppointmentId, followUpDateTime } = req.body;
    // Find the original appointment
    const originalAppointment = await AppointmentsModel.findById(originalAppointmentId);

    if (!originalAppointment) {
      return res.status(404).json({ message: 'Original appointment not found' });
    }

    // Create a new follow-up appointment
    const followUpAppointment = new AppointmentsModel({
      date: new Date(followUpDateTime),
      patient: originalAppointment.patient,
      doctor: originalAppointment.doctor,
      familyMember:originalAppointment.familyMember,
      type: "followup"
    });

    // Save the follow-up appointment to the database
    await followUpAppointment.save();

    return res.status(200).json({ message: 'Follow-up appointment scheduled successfully', followUpAppointment });
  } catch (error) {
    console.error('Error scheduling follow-up:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/myDoctors', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const appointments = await AppointmentsModel.find({
      patient: patient._id,
      cancelled: false,
    });

    const doctorsInfo = await Promise.all(
      appointments.map(async (appointment) => {
        const doctorId = appointment.doctor;
        const doctor = await DoctorsModel.findOne({ _id: doctorId });

        return {
          doctorName: doctor.name,
          doctorId: doctor._id,
        };
      })
    );
    // Function to filter unique values based on doctorId
    const filterUniqueDoctors = (doctorsInfo) => {
      const uniqueDoctorIds = new Set();
      return doctorsInfo.filter((info) => {
        if (!uniqueDoctorIds.has(info.doctorId.toString())) {
          uniqueDoctorIds.add(info.doctorId.toString());
          return true;
        }
        return false;
      });
    };

    const filteredDoctorsInfo = filterUniqueDoctors(doctorsInfo);
    return res.json(filteredDoctorsInfo);
  } catch (error) {
    console.error('Error fetching myDoctors:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/myPatients', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const doctor = await DoctorsModel.findOne({ username: decoded.username });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const appointments = await AppointmentsModel.find({
      doctor: doctor._id,
      cancelled: false,
    });

    // Use Set to store unique patient IDs
    const uniquePatientIds = new Set();

    // Map appointments to patient information
    const patientsInfo = await Promise.all(
      appointments.map(async (appointment) => {
        const patientId = appointment.patient;

        // Fetch patient information
        const patient = await PatientsModel.findOne({ _id: patientId });

        // Check if patient exists before adding to the result
        if (patient) {
          return {
            patientName: patient.name,
            patientId: patient._id.toString(), // Convert to string for consistency
          };
        }

        return null; // Skip if patient not found
      })
    );

    // Function to filter unique values based on patientId
    const filterUniquePatients = (patientsInfo) => {
      const unique = patientsInfo.filter((info) => {
        if (!uniquePatientIds.has(info.patientId)) {
          uniquePatientIds.add(info.patientId);
          return true;
        }
        return false;
      });
      return unique;
    };

    const filteredPatientsInfo = filterUniquePatients(patientsInfo);

    return res.json(filteredPatientsInfo);
  } catch (error) {
    console.error('Error fetching myPatients:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/myDoctors', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    const appointments = await AppointmentsModel.find({
      patient: patient._id,
      cancelled: false,
    });

    // Use Set to store unique patient IDs
    const uniqueDoctorIds = new Set();

    // Map appointments to patient information
    const doctorsInfo = await Promise.all(
      appointments.map(async (appointment) => {
        const doctorId = appointment.doctor;

        // Fetch patient information
        const doctor = await DoctorsModel.findOne({ _id: doctorId });

        // Check if patient exists before adding to the result
        if (doctor) {
          return {
            doctorName: doctor.name,
            doctorId: doctor._id.toString(), // Convert to string for consistency
          };
        }

        return null; // Skip if patient not found
      })
    );

    // Function to filter unique values based on patientId
    const filterUniquePatients = (doctorsInfo) => {
      const unique = doctorsInfo.filter((info) => {
        if (!uniqueDoctorIds.has(info.doctorId)) {
          uniqueDoctorIds.add(info.doctorId);
          return true;
        }
        return false;
      });
      return unique;
    };

    const filteredPatientsInfo = filterUniquePatients(doctorsInfo);

    return res.json(doctorsInfo);
  } catch (error) {
    console.error('Error fetching myPatients:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-family-discount', async (req, res) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');

    const patient = await PatientsModel.findOne({ username: decoded.username });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (patient.subscribedPackage && !patient.canceled) {
      const package = await PackagesModel.findById(patient.subscribedPackage);
      if (package) {
        // Fetch the family discount attribute from the package
        const familyMemberDiscount = package.familyMemberDiscount / 100 || 0;

        // Return the family discount attribute
        return res.json({ familyMemberDiscount });
      }
    }
    return res.json({ familyMemberDiscount: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/cancel-appointment/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // Find the appointment by ID
    const appointment = await AppointmentsModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the appointment is scheduled
    if (!(appointment.status === 'scheduled')) {
      return res.status(400).json({ message: 'Cannot cancel appointment with status other than scheduled' });
    }

    // Retrieve doctor information
    const doctor = await DoctorsModel.findById(appointment.doctor);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patient=await PatientsModel.findById(appointment.patient);

    // Check if the cancellation is allowed (e.g., at least 24 hours before the appointment)
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();
    const timeDifference = appointmentDate.getTime() - currentDate.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);
    doctor.availableSlots.push(appointmentDate);
    if (hoursDifference > 24) {
      // Deduct cost from both doctor and patient (you need to define these in your models)
      doctor.wallet -= appointment.cost;
      // Assuming the patient's balance is stored in the appointment model
      patient.wallet+=appointment.cost;
      // Save changes
      
    }
    sendPatientCancelEmail(patient.email, doctor.name,appointmentDate)
    sendDoctorCancelEmail(doctor.email,patient.name,appointmentDate)
    const newNotification = new NotificationsModel({
      patient: patient._id, // Replace with a valid patient ID
      doctor: doctor._id,   // Replace with a valid doctor ID
      date: appointmentDate,
      type:"cancel"           // Replace with the desired date=
    });
    // Save the new Notification object to the database
    newNotification.save();
    await doctor.save();
    await patient.save();

    // Update appointment status to 'canceled'
    appointment.cancelled = true;
    await appointment.save();

    // Send success response
    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/cancel-appointment-doctor/:id', async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // Find the appointment by ID
    const appointment = await AppointmentsModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Check if the appointment is scheduled
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Cannot cancel appointment with status other than scheduled' });
    }

    // Retrieve doctor information
    const doctor = await DoctorsModel.findById(appointment.doctor);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patient=await PatientsModel.findById(appointment.patient);

    // Check if the cancellation is allowed (e.g., at least 24 hours before the appointment)
    const appointmentDate = new Date(appointment.date);

      // Deduct cost from both doctor and patient (you need to define these in your models)
      doctor.wallet -= appointment.cost;
      // Assuming the patient's balance is stored in the appointment model
      patient.wallet+=appointment.cost;
      // Save changes
    sendPatientCancelEmail(patient.email, doctor.name,appointmentDate)
    sendDoctorCancelEmail(doctor.email,patient.name,appointmentDate)
    
    await doctor.save();
    await patient.save();

    // Update appointment status to 'canceled'
    appointment.cancelled = true;
    await appointment.save();

    // Send success response
    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/reschedule-appointment', async (req, res) => {
  const { rescheduleAppointmentId, rescheduleDateTime } = req.body;

  try {
    // Find the appointment by ID
    const appointment = await AppointmentsModel.findById(rescheduleAppointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment with the new date
    appointment.date = new Date(rescheduleDateTime);
    await appointment.save();
    const patient=await PatientsModel.findOne({_id:appointment.patient})
    const doctor=await DoctorsModel.findOne({_id:appointment.doctor})
    sendPatientRescheduleEmail(patient.email, doctor.name,appointment.date)
    sendDoctorRescEmail(doctor.email,patient.name,appointment.date)
    const newNotification = new NotificationsModel({
      patient: patient._id, // Replace with a valid patient ID
      doctor: doctor._id,   // Replace with a valid doctor ID
      date: rescheduleDateTime,
      type: "resc"           // Replace with the desired date=
    });
    // Save the new Notification object to the database
    newNotification.save();
    // Send success response
    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Assume you have a route like '/available-slots/:doctorId'
app.get('/available-slots/:appointmnetId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmnetId;

    const appointment=await AppointmentsModel.findById(appointmentId);

    const doctorId=appointment.doctor;
    // Retrieve doctor information from the database using the doctorId
    const doctor = await DoctorsModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Assuming the doctor model has an 'availableSlots' property
    const availableSlots = doctor.availableSlots.filter((slot) => new Date(slot) > new Date());
    // Return the available slots to the client
    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/reschedule-appointment-patient', async (req, res) => {
  const { appointmentId, rescheduleDateTime } = req.body;
  try {
    // Find the appointment by ID
    const appointment = await AppointmentsModel.findById(appointmentId);
    const patient=await PatientsModel.findOne({_id:appointment.patient});
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    const doctor=await DoctorsModel.findById(appointment.doctor);
    doctor.availableSlots.pull(new Date(rescheduleDateTime));
    doctor.availableSlots.push(appointment.date);
    // Update the appointment with the new date
    appointment.date = new Date(rescheduleDateTime);
    await appointment.save();
    sendPatientRescheduleEmail(patient.email, doctor.name,appointment.date)
    sendDoctorRescEmail(doctor.email,patient.name,appointment.date)
    const newNotification = new NotificationsModel({
      patient: patient._id, // Replace with a valid patient ID
      doctor: doctor._id,   // Replace with a valid doctor ID
      date: appointment.date, 
      type:"resc"          // Replace with the desired date=
    });
    // Save the new Notification object to the database
    newNotification.save();
    // Send success response
    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getRequests', async (req, res) => {
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
      const doctor=await DoctorsModel.findOne({username:decoded.username})
      // Fetch all appointments with type 'request'
      const appointments = await AppointmentsModel.find({ type: 'request',doctor:doctor._id });

      // Create an array to store the formatted appointment data
      const formattedAppointments = [];

      // Loop through each appointment and retrieve patient and family member names
      for (const appointment of appointments) {
          const patient = await PatientsModel.findById(appointment.patient);
          let patientName = patient ? patient.name : 'Unknown Patient';

          if (appointment.familyMember) {
              const familyMember = patient.familyMembers.find(member => member._id.equals(appointment.familyMember));
              patientName = familyMember ? familyMember.name : 'Unknown Family Member';
          }

          // Add formatted appointment data to the array
          formattedAppointments.push({
              appointmentId: appointment._id,
              appointmentDate: appointment.date.toLocaleString(),
              patientName: patientName,
          });
      }

      // Send the formatted appointment data in the response
      res.json(formattedAppointments);
  } catch (error) {
      // Handle errors
      console.error('Error fetching appointment requests:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/rejectRequest', async (req, res) => {
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {

      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 

      const doctorUsername = decoded.username;

      // Get the appointment ID from the request body
      const { appointmentId } = req.body;

      // Find the appointment to be rejected
      const appointment = await AppointmentsModel.findById(appointmentId);

      if (!appointment) {
          return res.status(404).json({ error: 'Appointment not found' });
      }

      // Remove the appointment from the appointmentsModel
      await AppointmentsModel.findByIdAndRemove(appointmentId);

      // Push the appointment date to the doctor's available slots
      const doctor = await DoctorsModel.findOne({ username: doctorUsername });

      if (doctor) {
          doctor.availableSlots.push(appointment.date);
          await doctor.save();
      }

      res.json({ message: 'Appointment rejected successfully' });
  } catch (error) {
      // Handle errors
      console.error('Error rejecting appointment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/acceptRequest', async (req, res) => {
  try {
      const { appointmentId } = req.body;
      const appointment = await AppointmentsModel.findById(appointmentId);

      if (!appointment) {
          return res.status(404).json({ error: 'Appointment not found' });
      }

      appointment.type = 'followup';
      await appointment.save();

      res.json({ message: 'Appointment accepted successfully' });
  } catch (error) {
      console.error('Error accepting appointment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-prescription', async (req, res) => {
  const { prescription, appointmentId } = req.body;
  const ObjectId = mongoose.Types.ObjectId
const medicines = prescription.map(item => ({
  name: item.name,
  dose: {
      daily: item.dosage.timesDaily || 1,
      days: item.dosage.numberOfDays || 1,
  },
}));
  try {
    const appointment=await AppointmentsModel.findOne({_id:appointmentId});
    await axios.post('http://localhost:3001/generate-pdf', { prescription, appointmentId });

    const updatePrescription=await PrescriptionModel.findOne({appointmentId:appointmentId})
    if(updatePrescription){
      updatePrescription.medicines= medicines;
      updatePrescription.save();
      res.json("success");
    }
    else{
    const newPrescription = new PrescriptionModel({
      medicines: medicines,
      appointmentId: appointmentId,
      patientID:appointment.patient,
      doctorID:appointment.doctor,
      fileName:appointmentId+".pdf",
      date:new Date()
  });
  if(appointment.familyMember){
    newPrescription.familyMmeber=appointment.familyMember.nationalID
  }
  newPrescription.save();

  appointment.prescribed=newPrescription._id;
  appointment.save();
  res.json("success");
  }} catch (error) {
    console.log("Hello");
      console.error('Error adding prescription:', error);
      res.status(500).json({ error: 'Error adding prescription' });
  }
});
app.get('/getPrescription', async (req, res) => {
  const appointmentId = req.query.appointmentId;
  try {
    const ObjectId = mongoose.Types.ObjectId;
      // Check if the appointment has a prescription
      const prescription = await PrescriptionModel.findOne({ appointmentId: new ObjectId(appointmentId) });
      if(prescription.filled){
        res.json("filled");
      }
      else if (prescription) {
          res.json(prescription.medicines);
      } 
  } catch (error) {
      console.error('Error getting prescription:', error);
      res.status(500).json({ error: 'Error getting prescription' });
  }
});

// Assuming you have a PrescriptionModel and MedicinesModel imported

app.get('/getPrescriptionDetails/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;
  try {
    // Find the prescription details by prescriptionId
    const prescription = await PrescriptionModel.findOne({_id:prescriptionId});
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    const updatedMedicines = await Promise.all(
      prescription.medicines.map(async (medicine) => {
        try {
          const response = await axios.get(`http://localhost:3002/medicines/${medicine.name}`);
          const { name, price, available, quantity, fileName, _id } = response.data;

          return { name, price,available, quantity, fileName, _id };
        } catch (error) {
          console.error(`Error fetching medicine details for ${medicine.name}:`, error);
          return null;
        }
      })
    );
    res.json(updatedMedicines);
  } catch (error) {
    console.error('Error fetching prescription details:', error);
    res.status(500).json({ error: 'Error fetching prescription details' });
  }
});

app.get('/patientName',async(req,res)=>{
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  const patient=await PatientsModel.findOne({username:decoded.username});
  res.json(patient.name);
  
});

app.post('/patientDiscount',async(req,res)=>{
  const token = req.header('Authorization');
  const { prescriptionID } = req.body;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
  const patient=await PatientsModel.findOne({username:decoded.username});
  const pres=await PrescriptionModel.findOne({_id:prescriptionID})
  const appointment=await AppointmentsModel.findOne({_id:pres.appointmentId})
  if(!appointment.familyMember){
    const package=await PackagesModel.findOne({_id:patient.subscribedPackage})
    if(package&&package.medicinesDiscount)
    res.json(package.medicinesDiscount/100);
    else
    res.json(0);
  }
  else {
    const familyMember = patient.familyMembers.find(member => member.name.toString() === appointment.familyMember.name.toString());
  
    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }
    const package = await PackagesModel.findOne({ _id: familyMember.subscribedPackage });
    if (package && package.medicinesDiscount) {
      res.json(package.medicinesDiscount / 100);
    } else {
      res.json(0);
    }
  }
  
  
});

app.put('/fillPres/:prescriptionId', async (req, res) => {
  const prescriptionId = req.params.prescriptionId;

  try {
    // Update the prescription with the provided ID and set filled to true
    await PrescriptionModel.findByIdAndUpdate(prescriptionId, { filled: true });

    // Send a success response
    res.status(200).json({ success: true, message: 'Prescription filled successfully' });
  } catch (error) {
    console.error('Error filling prescription:', error);
    res.status(500).json({ success: false, error: 'Error filling prescription' });
  }
});

app.get('/get-notifications', async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'random');
    const patient=await PatientsModel.findOne({username:decoded.username});
    const doctor=await DoctorsModel.findOne({username:decoded.username});

    if(patient){
      const notifications = await NotificationsModel
      .find({ patient: patient._id })
      .sort({ createdAt: -1 }) // Sort in descending order by createdAt
      .limit(5);
    
    const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
      let doctor=await DoctorsModel.findOne(notification.doctor);
      let message;
    
      switch (notification.type) {
        case 'new':
          message = `You have reserved an appointment on ${notification.date} with doctor: ${doctor.name}.`;
          break;
        case 'cancel':
          message = `Your appointment with doctor: ${doctor.name} on ${notification.date} has been canceled.`;
          break;
        case 'resc':
          message = `Your appointment with doctor: ${doctor.name} has been rescheduled on ${notification.date}.`;
          break;
        default:
          message = 'Unknown notification type.';
      }
    
      // Return a new object with the modified message
      return {
        ...notification.toObject(),
        message,
      };
    }));
    res.json(formattedNotifications);
    
    }
    else{
      const notifications = await NotificationsModel
      .find({ doctor: doctor._id })
      .sort({ createdAt: -1 }) // Sort in descending order by createdAt
      .limit(5);
      const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
        let patient=await PatientsModel.findOne(notification.patient);
        let message;
      
        switch (notification.type) {
          case 'new':
            message = `Patient: ${patient.name} have reserved an appointment on ${notification.date} with you.`;
            break;
          case 'cancel':
            message = `Appointment with Patient: ${patient.name} on ${notification.date} has been canceled.`;
            break;
          case 'resc':
            message = `Appointment with Patient: ${patient.name} has been rescheduled on ${notification.date}.`;
            break;
          default:
            message = 'Unknown notification type.';
        }
      
        // Return a new object with the modified message
        return {
          ...notification.toObject(),
          message,
        };
      }));
    res.json(formattedNotifications);

    }
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/createRoom', async (req, res) => {
  const { doctorId } = req.body;
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
      const patient=await PatientsModel.findOne({username:decoded.username});
      const patientId=patient._id;
    // Check if a room exists with the given patientId and doctorId
    const existingRoom = await RoomsModel.findOne({ patientId, doctorId });

    if (existingRoom) {
      res.json({ roomId: existingRoom._id });
    } else {
      // Create a new room and add it to the RoomsModel
      const newRoom = new RoomsModel({ patientId, doctorId });
      await newRoom.save();

      res.json({ roomId: newRoom._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createRoomDoctor', async (req, res) => {
  const { patientId } = req.body;
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
      const doctor=await DoctorsModel.findOne({username:decoded.username});
      const doctorId=doctor._id;
    // Check if a room exists with the given patientId and doctorId
    const existingRoom = await RoomsModel.findOne({ patientId, doctorId });

    if (existingRoom) {
      res.json({ roomId: existingRoom._id });
    } else {
      // Create a new room and add it to the RoomsModel
      const newRoom = new RoomsModel({ patientId, doctorId });
      await newRoom.save();

      res.json({ roomId: newRoom._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createVideoRoom', async (req, res) => {
  const { doctorId } = req.body;
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
      const patient=await PatientsModel.findOne({username:decoded.username});
      const patientId=patient._id;
    // Check if a room exists with the given patientId and doctorId
    const existingRoom = await videoRoomsModel.findOne({ patientId, doctorId });

    if (existingRoom) {
      res.json({ roomId: existingRoom._id });
    } else {
      // Create a new room and add it to the RoomsModel
      const newRoom = new videoRoomsModel({ patientId, doctorId });
      await newRoom.save();

      res.json({ roomId: newRoom._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/createVideoRoomDoctor', async (req, res) => {
  const { patientId } = req.body;
  const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token.replace('Bearer ', ''), 'random'); 
      const doctor=await DoctorsModel.findOne({username:decoded.username});
      const doctorId=doctor._id;
    // Check if a room exists with the given patientId and doctorId
    const existingRoom = await videoRoomsModel.findOne({ patientId, doctorId });

    if (existingRoom) {
      res.json({ roomId: existingRoom._id });
    } else {
      // Create a new room and add it to the RoomsModel
      const newRoom = new videoRoomsModel({ patientId, doctorId });
      await newRoom.save();

      res.json({ roomId: newRoom._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});