const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel = require('./models/admins');
const PackagesModel = require('./models/packages');
const AppointmentsModel=require('./models/appointment');
const PrescriptionModel=require('./models/prescriptions');

const app = express();

app.use(express.json());
// Enable CORS with credentials option
app.use(cors({ credentials: true, origin: true }));


var logged = {
  username: "men",
  in: "",
  type: ""
};

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
  const { username, password } = req.body;
  
  DoctorsModel.findOne({ username: username })
    .then((user) => {
      if (user) {
        
        if (user.password === password) {
          logged.in = true;
          logged.username = username;
          logged.type = "doctor";
          if (user.enrolled === "Rejected" || user.enrolled === "Request Not Made") {
            res.status(200).json({ message: "Success But Not Enrolled", enrolledStatus: user.enrolled });
          } else {
            res.status(200).json({ message: "Success" });
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
      const doctorRequests = await DoctorsModel.find({ enrolled: "Pending" });
      console.log(doctorRequests)
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
      await DoctorsModel.findByIdAndUpdate(doctorId, { enrolled: "Approved" });
  
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
  
      await DoctorsModel.findByIdAndUpdate(doctorId, { enrolled: "Rejected" });
  
      res.json({ message: 'Doctor approved successfully' });
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
  try {
    await DoctorsModel.updateOne({ username: req.body.username }, req.body);
    res.json({ message: 'Doctor info updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating doctor info.' });
  }
});

app.get('/get-doctor-info', async (req, res) => {
  try {
    const loggedUsername = logged.username; 
    const doctorInfo = await UserModel.findOne({ username: loggedUsername });
    if (!doctorInfo) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctorInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//view a list of all my Prescriptions   (Req 54)

app.post('/pre', async (req, res) => {
  try {
    const preData = req.body;
    const newPrescription = new PrescriptionModel(preData);

    await newPrescription.save();

    res.json({ message: 'Prescription added successfully' });
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//--------------------------
//view a list of all my Prescriptions   (Req 54)

app.get('/get-prescriptions/:patientID', async (req, res) => {
  try {
    const patientID = req.params.patientID;
    const prescriptions = await PrescriptionModel.find({ patientID });

    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ message: 'No prescriptions found for the patient' });
    }

    res.json(prescriptions);
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
  console.log(req.body);
  try{
    await PatientsModel.updateOne({username:logged.username},{$push: {familyMembers: {nationalID: nationalID, age:age, name:name, gender:gender, relation, relation}}});
    res.json({message:"Family Member info added successfully."});

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured while updating family members."});
  }});


  // view family memebers
app.get('/view-family-members' , async (req, res) => {
  try {
    const familyMemberIds = patient.familyMembers;
    const familymem = await PatientsModel.find({  _id: { $in: familyMemberIds } } );
    res.json(familymem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching family members ' });
  }
} );

// filter appointments by date/status for doc
app.get('/doctors/:doctorId/appointments', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { date, status } = req.query;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const query = { doctorId };
    if (date) {
      query.date = new Date(date);
    }
    if (status) {
      query.status = status;
    }
    const appointments = await AppointmentsModel.find(query);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while filtering appointments' });
  }
});


// filter appointments by date/status for patient
app.get('/patients/:patientId/appointments', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { date, status } = req.query;
    const patient = await PatientsModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const query = { patientId };
    if (date) {
      query.date = new Date(date);
    }
    if (status) {
      query.status = status;
    }
    const appointments = await AppointmentsModel.find(query);
    res.json(appointments);
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
    const doctors = await DoctorsModel.find({}).select('name specialty hourlyRate');
    const patient = await PatientsModel.findOne({ username: logged.username });
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
  app.listen(3001,'localhost')