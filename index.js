const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel = require('./models/admins');
const PackagesModel = require('./models/packages');

const app = express();
app.use(express.json());
// Enable CORS with credentials option
app.use(cors({ credentials: true, origin: true }));
app.use(
  session({
    secret: 'your-secret-key', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);

var logged = {
  username: "",
  in: "",
  type: ""
};

mongoose.connect('mongodb://127.0.0.1:27017/clinic');

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
              logged.in=true;
              logged.username=username;
              logged.type="doctor";
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
              logged.in=true;
              logged.username=username;
              logged.type="patient";
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
        logged.in=true;
        logged.username="admin";
        logged.type="admin";
        res.json("Success");
        
      }
    
    else{
        AdminsModel.findOne({ username: username })
        .then(user => {
          if (user) {
            if (user.password === password) {
              logged.in=true;
              logged.username=username;
              logged.type="admin";
              res.json("Success");
            } else {
              res.json("Password incorrect");
            }
          } else {
            res.json("Username isn't registered");
          }
        })
  }});

  app.get('/get-user-type', (req, res) => {
    res.json(logged);
  });

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
      const admins = await AdminsModel.find({ username: { $ne: logged.username } });
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

//view list of all specfic doctor patients (Req 33)
app.get('/get-my-patients', async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(404).json({error:'Invalid ID'});
  }
  const patients = await PatientsModel.find({ doctorId: doctorId });
  res.json(patients);
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
  
  //view list of all specfic doctor patients (Req 33)
app.get('/get-my-patients', async (req, res) => {
  const doctorId = req.params.doctorId;
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(404).json({error:'Invalid ID'});
  }
  const patients = await PatientsModel.find({ doctorId: doctorId });
  res.json(patients);
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
    console.log(req.body)
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
  try {
    const doctorInfo = await DoctorsModel.findOne({ username: logged.username });
    res.json(doctorInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching doctor info.' });
  }
});

app.put('/update-doctor-info', async (req, res) => {
  const { affiliation, hourlyRate, email } = req.body;

  try {
    await DoctorsModel.updateOne({ username: logged.username }, { affiliation, hourlyRate, email });
    res.json({ message: 'Doctor info updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating doctor info.' });
  }
});

// filter  a doctor by speciality and/or availability on a certain date and at a specific time (39)
app.get('/filter', async (req, res) => {
  const { specialty, date, time } = req.query;

  try {
    let query = {};

    if (specialty) {
      query.specialty = { $regex: new RegExp(specialty, 'i') }; // Case-insensitive search for specialty
    }

    if (date && time) {
      query.availability = { $elemMatch: { day: date, time: time } }; // Match availability on the specified date and time
    }

    const doctors = await DoctorsModel.find(query);

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// search for a doctor by name and/or speciality (38)
app.get('/search', async (req, res) => {
  const { name, specialty } = req.query;
  console.log("Received request. Name:", name, "Specialty:", specialty);

  if (!specialty || specialty === "") {
    try {
      const doctors = await DoctorsModel.find({ name: name });
      console.log("Found doctors:", doctors);
      res.json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating doctor info.' });
    }
  } else if (name === "") {
    console.log(2);
    try {
      const doctors = await DoctorsModel.find({ speciality: specialty });
      console.log("Found doctors:", doctors);
      res.json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating doctor info.' });
    }
  } else {
    console.log(3);
    try {
      const doctors = await DoctorsModel.find({ name: name, speciality: specialty });
      console.log("Found doctors:", doctors);
      res.json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating doctor info.' });
    }
  }
});

  /*try {
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
    }

    if (specialty) {
      query.specialty = { $regex: new RegExp(specialty, 'i') }; // Case-insensitive search for specialty
    }

    const doctors = await DoctorsModel.find(query);

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }*/


// select a doctor from the search/filter results (40)
app.post('/select', async (req, res) => {
  const { doctorName, patientUsername } = req.body;
  console.log("Received request. Doctor Name:", doctorName, "Patient Username:", patientUsername);

  try {
    // Find the doctor by name
    const doctor = await DoctorsModel.findOne({ name: doctorName }); 

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if the patient has already selected this doctor
    if (!doctor.selectedBy) {
      doctor.selectedBy = [];
    }

    if (doctor.selectedBy.includes(patientUsername)) {
      return res.status(400).json({ message: 'You have already selected this doctor' });
    }

    // Add the patient's username to the selectedBy array
    doctor.selectedBy.push(patientUsername);
    await doctor.save();

    res.json({ message: 'Doctor selected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});





// view all details of selected doctor including specilaty, affiliation (hospital), educational background (41)

app.get('/selected/:doctorName', async (req, res) => {
  const { doctorName } = req.params;

  try {
    // Find the doctor by name
    const doctor = await DoctorsModel.findOne({ name: doctorName });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Return the detailed information of the selected doctor
    const doctorDetails = {
      name: doctor.name,
      specialty: doctor.specialty,
      affiliation: doctor.affiliation,
      educationalBackground: doctor.educationalBackground,
      // Add any other details you want to return
    };

    res.json(doctorDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


  app.listen(3001,'localhost')