const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel = require('./models/admins');
const PackagesModel = require('./models/packages');
const AppointmentsModel=require('./models/appointment');
const PrescriptionModel=require('./models/prescriptions');
const AppointmentModel = require('./models/appointment');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

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
const app = express();

app.use(express.json());
// Enable CORS with credentials option
app.use(cors({ credentials: true, origin: true }));


var logged = {
  username: "",
  in: "",
  type: ""
};

mongoose.connect('mongodb://localhost:27017/clinic');



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

// Register route for patients and doctors
app.post('/register-patient', async(req, res) => {
  const userData = req.body;
  const existingPatientEmail= await PatientsModel.findOne({ email: userData.email.toLowerCase() })
  const existingDoctorEmail=await DoctorsModel.findOne({ email: userData.email.toLowerCase() })
  const existingAdminEmail=await AdminsModel.findOne({ email: userData.email.toLowerCase() })
  const existingPatientUsername= await PatientsModel.findOne({ username: userData.username.toLowerCase() })
  const existingDoctorUsername=await DoctorsModel.findOne({ email: userData.username.toLowerCase() })
  const existingAdminUsername=await AdminsModel.findOne({ email: userData.username.toLowerCase() })
  if (userData.username.toLowerCase()=="admin"||existingPatientEmail || existingDoctorEmail || existingAdminEmail || existingPatientUsername||existingDoctorUsername||existingAdminUsername){
    return res.status(400).json({ message: 'Username/Email Associated With an Existing Account' });
  }
  // Check if a user with the same username already exists in PatientsModel
  PatientsModel.findOne({ username: userData.username.toLowerCase() })
    .then(existingPatient => {
      if (existingPatient) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        // Check if an account with the same phone number already exists
        PatientsModel.findOne({ mobileNumber: userData.mobileNumber })
          .then(existingPatientByPhone => {
            if (existingPatientByPhone) {
              return res.status(400).json({ message: 'An account with the same phone number already exists' });
            } else {
              // Check if an account with the same email already exists
              PatientsModel.findOne({ email: userData.email })
                .then(existingPatientByEmail => {
                  if (existingPatientByEmail) {
                    return res.status(400).json({ message: 'An account with the same email already exists' });
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
  if (userData.username.toLowerCase()=="admin"||existingPatientEmail || existingDoctorEmail || existingAdminEmail || existingPatientUsername||existingDoctorUsername||existingAdminUsername){
    return res.status(400).json({ message: 'Email Associated With an Existing Account' });
  }
  // Check if a user with the same username already exists in DoctorsModel
  DoctorsModel.findOne({ username: userData.username })
    .then(existingDoctor => {
      if (existingDoctor) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        // If the username is unique, create the new doctor
        DoctorsModel.create(userData)
          .then(doctor => res.json(doctor))
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

app.post('/upload-medical-licenses/:username', upload.array('medicalLicenses', 5), (req, res) => {
  const username = req.params.username;
  const medicalLicenses = req.files;
  // Check if a doctor with the given username exists in the DoctorsModel
  DoctorsModel.findOne({ username: username })
    .then(existingDoctor => {
      if (!existingDoctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      // Process and update the medical licenses for the doctor
      // You can use the "existingDoctor" to identify the doctor and update their information in the database.
      const medicalLicensesData = medicalLicenses.map(file => ({
        fileName: file ? file.filename : '',
        filePath: file ? file.path : '',
      }));

      existingDoctor.medicalLicenses = medicalLicensesData;

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
          logged.in = true;
          logged.username = username;
          logged.type = "doctor";
          if (user.enrolled === "Pending" || user.enrolled === "Request Not Made") {
            logged.type = "doctornotreg";
            res.status(200).json({ message: "Success But Not Enrolled", enrolledStatus: user.enrolled });
          } else if(user.enrolled === "PendingContract") {
            res.status(200).json({ message: "Waiting for contract" });
          }
          else{
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
    PatientsModel.findOne({ username: username.toLowerCase() })
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
    if(username.toLowerCase()==="admin"&&password=="admin"){
        logged.in=true;
        logged.username="admin";
        logged.type="admin";
        res.json("Success");
        
      }
    
    else{
        AdminsModel.findOne({ username: username.toLowerCase() })
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
    const existingPatientEmail= await PatientsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingDoctorEmail=await DoctorsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingAdminEmail=await AdminsModel.findOne({ email: adminData.email.toLowerCase() })
  const existingPatientUsername= await PatientsModel.findOne({ username: adminData.username.toLowerCase() })
  const existingDoctorUsername=await DoctorsModel.findOne({ email: adminData.username.toLowerCase() })
  const existingAdminUsername=await AdminsModel.findOne({ email: adminData.username.toLowerCase() })
  if (existingPatientEmail || existingDoctorEmail || existingAdminEmail || existingPatientUsername||existingDoctorUsername||existingAdminUsername){
    return res.status(400).json({ message: 'Email Associated With an Existing Account' });
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
    try {
      await DoctorsModel.findOneAndUpdate({ username:logged.username }, { enrolled: "Approved" });
      res.json({ message: 'Doctor approved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/reject-contract', async (req, res) => {
    try {
  
      await DoctorsModel.deleteOne({ username:logged.username });
      res.json({ message: 'Doctor Rejected Successfully' });
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
  try {
    // Find the doctor based on the logged-in username
    const doctor = await DoctorsModel.findOne({ username: logged.username });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find all appointments for the doctor
    const appointments = await AppointmentModel.find({ doctor: doctor._id });

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
    console.log(patientInfo);
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
    const existingPatientEmail = await PatientsModel.findOne({ email: req.body.email.toLowerCase() });
    const existingDoctorEmail = await DoctorsModel.findOne({ email: req.body.email.toLowerCase() });
    const existingAdminEmail = await AdminsModel.findOne({ email: req.body.email.toLowerCase() });
  
    if (existingPatientEmail || existingDoctorEmail || existingAdminEmail) {
      return res.status(400).json({ message: 'Email Associated with Another Account' });
    }
  
    await DoctorsModel.updateOne({ username: logged.username }, req.body);
    return res.json({ message: 'Doctor info updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating doctor info.' });
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

app.get('/get-prescriptions/', async (req, res) => {
  /*const ObjectId = mongoose.Types.ObjectId;
  const prescriptionsData = [
  {
    patientID: new ObjectId("6529833f0e7babc4174c5f91"),
    doctorID: new ObjectId("652983a00e7babc4174c5f97"),
    date: new Date(),
    medicines: [
      { name: "Aspirin", type: "Tablet" },
      { name: "Ibuprofen", type: "Capsule" },
    ],
  },
  {
    patientID: new ObjectId("6529833f0e7babc4174c5f92"),
    doctorID: new ObjectId("652983a00e7babc4174c5f97"),
    date: new Date(),
    medicines: [
      { name: "Lisinopril", type: "Tablet" },
    ],
  },
  {
    patientID: new ObjectId("6529833f0e7babc4174c5f91"),
    doctorID: new ObjectId("652983a00e7babc4174c5f97"),
    date: new Date(),
    medicines: [],
  },
];

  await PrescriptionModel.create(prescriptionsData);
  */
  try {
    // Find the patient with the given username
     // Replace with the actual logged username
    const patient = await PatientsModel.findOne({ username: logged.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find prescriptions for the patient
    const prescriptions = await PrescriptionModel
      .find({ patientID: patient._id })
      .select('doctorID date medicines') // Select the fields you need
      .populate({
        path: 'doctorID',
        select: 'name', // Select the doctor's name
        model: DoctorsModel,
      });

    // Process the prescriptions to add the 'status' field
    const updatedPrescriptions = prescriptions.map((prescription) => {
      const status = prescription.medicines.length > 0 ? 'filled' : 'unfilled';
      return {
        medicines: prescription.medicines,
        doctorName: prescription.doctorID.name,
        date: prescription.date,
        status: status,
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
  try{
    await PatientsModel.updateOne({username:logged.username},{$push: {familyMembers: {nationalID: nationalID, age:age, name:name, gender:gender, relation:relation}}});
    res.json({message:"Family Member info added successfully."});

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured while updating family members."});
  }});
  app.put("/add-existing-family-member",async (req,res)=>{
    const{email, phone, relation}=req.body;
    const user=await PatientsModel.findOne({username:logged.username});

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
    const userType = logged.type; // Assuming you have the user type in req.logged
    const username = logged.username; // Assuming you have the username in req.logged
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
  });

  app.get('/get-wallet-value', (req, res) => {
    const userType = logged.type; // Assuming you have the user type in req.logged
    const username = logged.username; // Assuming you have the username in req.logged
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
  });
  // view family memebers
  app.get('/view-family-members', async (req, res) => {
    try {
      const patient = await PatientsModel.findOne({ username: logged.username });
  
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
  try {
    const doctor = await DoctorsModel.findOne({ username: logged.username });

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
          followedUp:appointment.followedUp
        };
        enhancedAppointments.push(enhancedAppointment);
      }
      } else if(appointment.familyMember.account==null){
        console.log("Helloooo")
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
            followedUp:appointment.followedUp
          };
          console.log(enhancedAppointment);
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
    const familyMemberId = req.params.familyMemberId;
    const doctorId = req.params.doctorId;

    // Fetch patient details based on the username
    const patient = await PatientsModel.findOne({ username: logged.username });

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
  try {
    
    const patient = await PatientsModel.findOne({ username: logged.username });

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
    const doctors = await DoctorsModel.find({enrolled:'Approved'});

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

app.post('/wallet-payment', async (req, res) => {
  try {
      const { totalPaymentDue } = req.body;

      // Find the patient by username
      const patient = await PatientsModel.findOne({ username: logged.username});

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
    // Update the user's subscription
    if(self!="false"){
    await PatientsModel.findOneAndUpdate(
      { username: logged.username },
      { subscribedPackage: packageId, subscriptionDate: new Date(), canceled: null}
    );
    }
    const user = await PatientsModel.findOne({ username: logged.username });
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
      { username: logged.username },
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
  const result=new Object();
  
  const user=await PatientsModel.findOne({username:logged.username});
  if(user){
  const package=await PackagesModel.findOne({_id:user.subscribedPackage});

  result.package=package;
  result.subscribedDate=user.subscriptionDate;
  result.canceled=user.canceled;

  res.json(result);
  }
});
app.post('/cancel-subscription', async (req, res) => {
  await PatientsModel.findOneAndUpdate({username:logged.username},{canceled:new Date()})
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
      // Query the PackagesModel to find the family member's package
      const patient = await PatientsModel.findOne({ username:logged.username});
      const familyMember = patient.familyMembers.find((member) => member._id.equals(memberId));

      if (!familyMember) {
        return res.status(404).json({ error: 'Family member not found for the given memberID' });
      }

      res.json({
        canceled: familyMember.canceled,
        subscriptionDate: familyMember.subscriptionDate,
      });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});
app.post('/cancel-family-subscription/:id', async (req, res) => {
  try {
      const memberId = req.params.id;
      // Query the PatientsModel to find the family member's package
      const patient = await PatientsModel.findOne({ username: logged.username });
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
      res.status(500).json({ error: 'Server error' });
  }
});

app.post('/logout', (req, res) => {
  logged = {
    username: "",
    in: "",
    type: ""
  };
  res.status(200).json({ message: 'logged out successfully' });
});

app.post('/doctors/add-appointments', async (req, res) => {
  const { appointments } = req.body;

  try {
    // Find the doctor by username
    const doctor = await DoctorsModel.findOne({ username:logged.username });

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

  try {
    // Retrieve patient ID based on username
    const patient = await PatientsModel.findOne({ username: logged.username });

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
        date: dateTime
      });
      tempAppoitnment.save();
    }
    // Create a new appointment in AppointmentsModel
    const newAppointment = new AppointmentsModel({
      doctor: doctorId,
      patient: patient._id, // Assign the patient's ID
      date: dateTime,
      familyMember: data
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
  const patientUsername = logged.username; // Assuming you have authentication middleware

  try {
    // Retrieve patient ID based on username
    const patient = await PatientsModel.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create a new appointment in AppointmentsModel
    const newAppointment = new AppointmentsModel({
      doctor: doctorId,
      patient: patient._id, // Assign the patient's ID
      date: dateTime,
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

    await newAppointment.save();
    await doctor.save();

    res.status(200).json({ message: 'Appointment reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reserve appointment' });
  }
});
app.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userType = logged.type; // Assuming you have a middleware to get user type

  try {
    let user;

    // Check the user's type and access the appropriate model
    if (userType === 'admin') {
      user = await AdminsModel.findOne({ username: logged.username });
    } else if (userType === 'patient') {
      user = await PatientsModel.findOne({ username: logged.username });
    } else if (userType === 'doctor') {
      user = await DoctorsModel.findOne({ username: logged.username });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
  let email;
  let userType;
  let userModel;
  if (username) {
    const patient = await PatientsModel.findOne({ username });
    if (patient) {
      email = patient.email;
      userType = 'patient';
      userModel = PatientsModel;
    } else {
      const admin = await AdminsModel.findOne({ username });
      if (admin) {
        email = admin.email;
        userType = 'admin';
        userModel = AdminsModel;
      } else {
        const doctor = await DoctorsModel.findOne({ username });
        if (doctor) {
          email = doctor.email;
          userType = 'doctor';
          userModel = DoctorsModel;
        }
      }
    }
  }

  if (!email) {
    return res.status(404).json({ message: 'User not found' });
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
    res.status(400).json({ message: 'Invalid OTP' });
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
    const patient = await PatientsModel.findOne({ username: logged.username });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
    } else {
      res.status(200).json(patient.medicalHistory);
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname; 
    const patient = await PatientsModel.findOne({ username: logged.username });

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
    // Fetch health records for the specific patient
    const patient = await PatientsModel.findOne({username:logged.username});

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
    const { recordId } = req.params;
    const patient = await PatientsModel.findOne({ username: logged.username }).exec();

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

app.get('/get-family-discount', async (req, res) => {
  try {
      const patient = await PatientsModel.findOne({username:logged.username});

      if (!patient) {
          return res.status(404).json({ error: 'Patient not found' });
      }

      if (patient.subscribedPackage&&!patient.canceled) {
          const package = await PackagesModel.findById(patient.subscribedPackage);
          if (package) {
              // Fetch the family discount attribute from the package
              const familyMemberDiscount = package.familyMemberDiscount /100|| 0;

              // Return the family discount attribute
              return res.json({ familyMemberDiscount });
          }
      }

      // If the patient does not have a subscribed package or the package does not exist
      // Return 0 as the family discount
      return res.json({ familyMemberDiscount: 0 });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001,'localhost')