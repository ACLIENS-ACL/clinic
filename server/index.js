// Import necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel=require('./models/admins');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/clinic');

// Register route for patients
app.post('/register-patient', (req, res) => {
  const patientData = req.body;
  PatientsModel.create(patientData)
    .then(patient => res.json(patient))
    .catch(err => res.status(400).json(err));
});

// Register route for doctors
app.post('/register-doctor', (req, res) => {
  const doctorData = req.body;
  DoctorsModel.create(doctorData)
    .then(doctor => res.json(doctor))
    .catch(err => res.status(400).json(err));
});

app.post('/login-doctor', (req, res) => {
    const {username, password} = req.body;
    DoctorsModel.findOne({ username: username })
        .then(user => {
          if (user) {
            if (user.password === password) {
              res.json("Success");
            } else {
              res.json("Password incorrect");
            }
          } else {
            res.json("username isn't registered");
          }
        })
        .catch(err => res.status(400).json(err));
  });

  app.post('/login-patient', (req, res) => {
    const {username, password} = req.body;
    PatientsModel.findOne({ username: username })
        .then(user => {
          if (user) {
            if (user.password === password) {
              res.json("Success");
            } else {
              res.json("Password incorrect");
            }
          } else {
            res.json("username isn't registered");
          }
        })
        .catch(err => res.status(400).json(err));
  });

  app.post('/login-admin', (req, res) => {
    const {username, password} = req.body;
    if(username==="admin"&&password=="admin"){
        res.json("Success");
    }
    else{
        AdminsModel.findOne({ username: username })
        .then(user => {
          alert(user.username)
          if (user) {
            if (user.password === password) {
              res.json("Success");
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

    const existingAdmin = await AdminsModel.findOne({ username: adminData.username });

    if (existingAdmin) {
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
      // Find all doctors with "enrolled" set to false
      const doctorRequests = await DoctorsModel.find({ enrolled: false });
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
      await DoctorsModel.findByIdAndUpdate(doctorId, { enrolled: true });
  
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
      await DoctorsModel.findByIdAndRemove(doctorId);
  
      res.json({ message: 'Doctor rejected and removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/get-admins', async (req, res) => {
    try {
      const admins = await AdminsModel.find();
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
    const doctors = await DoctorsModel.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching doctors.' });
  }
});

// POST endpoint to remove a doctor by ID
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

  
  app.listen(3001,'localhost')