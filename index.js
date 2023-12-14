const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const PatientsModel = require('./models/patients');
const DoctorsModel = require('./models/doctors');
const AdminsModel = require('./models/admins');
const PackagesModel = require('./models/packages');
const AppointmentsModel=require('./models/appointment');
const PrescriptionModel=require('./models/prescriptions');
const AppointmentModel = require('./models/appointment');
const FollowUpModel = require('./models/folllowup');
const MongoURI = process.env.MONGO_URI;
const app = express();

app.use(express.json());
// Enable CORS with credentials option
app.use(cors({ credentials: true, origin: true }));



var logged = {
  username: "",
  in: "",
  type: ""
};

 //mongoose.connect('mongodb://localhost:27017/clinic');

// mongoose.connect('mongodb://0.0.0.0:27017').then(() => {
//   console.log('Connected to the database');
// }).catch((err) => {
//   console.error('Error connecting to the database', err);
// });


// Register route for patients and doctors
app.post('/register-patient', (req, res) => {
  const userData = req.body;

  // Check if a user with the same username already exists in PatientsModel
  PatientsModel.findOne({ username: userData.username.toLowerCase() })
    .then(existingPatient => {
      if (existingPatient) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        // If the username is unique, create the new patient
        PatientsModel.create(userData)
          .then(patient => res.json(patient))
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(500).json(err));
});

app.post('/register-doctor', (req, res) => {
  const userData = req.body;

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

    const existingAdmin = await AdminsModel.findOne({ username: adminData.username.toLowerCase() });

    if (existingAdmin||(req.body.username.toLowerCase()=="admin")) {
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
  
      await DoctorsModel.deleteOne({ _id: doctorId });
  
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

//view list of all specfic doctor patients (Req 33)
app.get('/get-my-patients', async (req, res) => {
  /*const dataItem={
    "patient": "652675a1ed54a6df4a66974b", // Replace with the actual patient ID
    "doctor": "65257dc968db8eab87b0f288",  // Replace with the actual doctor ID
    "date": "2023-12-15T14:30:00.000Z",  // Replace with the desired date and time
    "status": "scheduled"
  };
  await AppointmentModel.create(dataItem);
  const ddataItem={
    "patient": "6525c68c1ff94d12ed88fb0f", // Replace with the actual patient ID
    "doctor": "65257dc968db8eab87b0f288",  // Replace with the actual doctor ID
    "date": "2023-12-15T14:30:00.000Z",  // Replace with the desired date and time
    "status": "scheduled"
  };
  await AppointmentModel.create(ddataItem);*/
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
      return {
        info: {
          name: patient.name,
          email: patient.email,
          dob:patient.dob,
          gender:patient.gender,
          mobileNumber:patient.mobileNumber,
          emergencyContactName:patient.emergencyContactName,
          emergencyContactNumber:patient.emergencyContactNumber,
          healthRecords:patient.healthRecords,
          date: appointment.date,
        },
      };
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
    await DoctorsModel.updateOne({ username:logged.username }, req.body);
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
    console.log(updatedPrescriptions);
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
    await PatientsModel.updateOne({username:logged.username},{$push: {familyMembers: {nationalID: nationalID, age:age, name:name, gender:gender, relation, relation}}});
    res.json({message:"Family Member info added successfully."});

  }catch(error){
    console.error(error);
    res.status(500).json({message:"An error occured while updating family members."});
  }});


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
      // Find the doctor using the doctor's ID in the appointment
      const patient = await PatientsModel.findOne({ _id: appointment.patient });

      if (patient) {
        // Enhance the appointment object with doctor's name
        const enhancedAppointment = {
          _id: appointment._id,
          date: appointment.date,
          status: appointment.status,
          patientName: patient.name,
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

      if (doctor) {
        // Enhance the appointment object with doctor's name
        const enhancedAppointment = {
          _id: appointment._id,
          date: appointment.date,
          status: appointment.status,
          doctorName: doctor.name,
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
    /*for (const doctor of doctors) {
      const numberOfSlots = 5;
      const randomSlots = [];
      for (let i = 0; i < numberOfSlots; i++) {
        const today = new Date();
        const randomDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + Math.floor(Math.random() * 30), // Random day of the month
          8 + Math.floor(Math.random() * 4), // Random hour (8-11)
          Math.floor(Math.random() * 60) // Random minute (0-59)
        );
        randomSlots.push(randomDate.toISOString()); // Convert to ISO 8601 string
      }
    
      // Update the doctor's availableSlots field with the randomSlots array
      doctor.availableSlots = randomSlots.map((slot) => new Date(slot));
    
      // Save the updated doctor document
      await doctor.save();
    }*/
    
    
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
    if(self){
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

    familyMembers.forEach((member) => {
      members.forEach((patientMem) => {
        if (patientMem.name === member) {
          patientMem.subscribedPackage = packageId;
          patientMem.subscriptionDate=new Date();
          patientMem.canceled=null;
        }
      });
    });
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
  const package=await PackagesModel.findOne({_id:user.subscribedPackage});

  result.package=package;
  result.subscribedDate=user.subscriptionDate;
  result.canceled=user.canceled;

  res.json(result);
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
          console.log(package);
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
    console.log(memberId);
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


app.put('/change-password', async (req, res) => {
  const { username, password, newPassword,confirmNewPassword } = req.body;
  

  try {
    let user="";
    console.log(logged.type);

    if(logged.type === "patient")
    {
       user = await PatientsModel.findOne({  username: logged.username.toLowerCase()  });
    }
    else if(logged.type === "admin")
    {
       user = await AdminsModel.findOne({  username: logged.username.toLowerCase()  });
    }

    else if(logged.type === 'doctor')
    {
       user = await DoctorsModel.findOne({  username: logged.username.toLowerCase()  });
    }
    else{
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    else if (user.password !== password) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    else if (newPassword !== confirmNewPassword) {
      return res.status(500).json({ error: "Password confirmation doesn't match entered password" });
      
    }
    else if(
        newPassword.length < 8 ||  !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || /\s/.test(newPassword)  ) 
        {
          return res.status(400).json({
            message: 'New password does not meet the required criteria.',
          });
        }
    else{
      user.password = newPassword;
       await user.save();
       res.status(200).json({ message: 'Password changed successfully' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//upload/remove documents (PDF,JPEG,JPG,PNG) for my medical history (Req 2)
const fs = require('fs');
const path = require('path');

app.put('/upload-document', async (req, res) => {
  const { document } = req.body;
  const { type, data, filename } = document;
  const allowedTypes = ['pdf', 'jpeg', 'jpg', 'png'];
  const extension = filename.split('.').pop().toLowerCase();

  if (!allowedTypes.includes(extension)) {
    return res.status(400).send('Invalid file type');
  }

  const filePath = path.join(__dirname, 'medical-history', `${filename}`);
  const fileExists = fs.existsSync(filePath);

  if (type === 'add') {
    if (fileExists) {
      return res.status(400).send('File already exists');
    }

    fs.writeFileSync(filePath, data, 'base64');
    return res.status(200).send('File uploaded successfully');
  } else if (type === 'remove') {
    if (!fileExists) {
      return res.status(400).send('File does not exist');
    }

    fs.unlinkSync(filePath);
    return res.status(200).send('File removed successfully');
  } else {
    return res.status(400).send('Invalid request type');
  }
});
//upload and submit required documents upon registrationas a doctor such as ID, Medical licenses and medical degree 
app.put('/upload-document', async (req, res) => {
  const { document } = req.body;
// Upload and submit required documents upon registration as a doctor such as ID, Medical licenses and medical degree
app.put('/upload-doctor-documents', async (req, res) => {
  const { document } = req.body;
  const { type, data, filename } = document;
  const allowedTypes = ['pdf', 'jpeg', 'jpg', 'png'];
  const extension = filename.split('.').pop().toLowerCase();

  if (!allowedTypes.includes(extension)) {
    return res.status(400).send('Invalid file type');
  }

  const filePath = path.join(__dirname, 'medical-history', `${filename}`);
  const fileExists = fs.existsSync(filePath);

  if (type === 'add') {
    if (fileExists) {
      return res.status(400).send('File already exists');
    }

    fs.writeFileSync(filePath, data, 'base64');
    return res.status(200).send('File uploaded successfully');
  } else if (type === 'remove') {
    if (!fileExists) {
      return res.status(400).send('File does not exist');
    }

    fs.unlinkSync(filePath);
    return res.status(200).send('File removed successfully');
  } else {
    return res.status(400).send('Invalid request type');
  }
});
//request the employment contract
app.post('/employment-contract', async (req, res) => {
  // code to retrieve employment contract from database or file system
  const employmentContract = "This is the employment contract text.";

  res.status(200).send(employmentContract);
});

app.post('/accept-employment-contract', async (req, res) => {
  // code to update user's employment contract acceptance status in database
  const userId = req.body.userId;
  const accepted = req.body.accepted;

  // code to update user's employment contract acceptance status in database
  res.status(200).send(`Employment contract acceptance status updated for user ${userId}.`);
});
  const userId = req.body.userId;
  const accepted = req.body.accepted;

  // code to update user's employment contract acceptance status in database
  res.status(200).send(`Employment contract acceptance status updated for user ${userId}.`);
});




// patient payment choice for appointments (req 20 & 21)



// app.post('/process-payment', async (req, res) => {
//   try {
//     const { paymentMethod, amount, appointmentId } = req.body;
//     const patient = await PatientsModel.findOne({ username: logged.username });
//     const appointment = await AppointmentModel.findById(appointmentId);
    
//     if (paymentMethod === 'wallet') {
//              try {
//               if (!patient || !appointment ) {
//                 return res.status(400).json({ error: 'Invalid patient or appointment ' });
//               }
//           if (appointment.paid == true)
//           {
//             return res.status(400).json({ error: 'appointment is already paid ' });
//           }
          
//               if (patient.walletBalance < appointment.appointmentFee) {
//                 return res.status(400).json({ error: 'Insufficient funds in the wallet' });
//               }
          
//               patient.walletBalance -= appointment.appointmentFee;
//               await patient.save();
//               appointment.paid = true;
//               await appointment.save();
//               res.json({ message: 'Payment successful using wallet' });
//             } catch (error) {
            
//               res.status(500).json({ error: 'An error occurred while processing wallet payment' });
//             }

//           }
//           else if (paymentMethod === 'creditCard') {
//                   try {

//                     if (!patient || !appointment ) {
//                       return res.status(400).json({ error: 'Invalid patient or appointment ' });
//                     }
//                else if (appointment.paid == true)
//                    {
//                   return res.status(400).json({ error: 'appointment is already paid ' });
//                   }
//                     else{
//                           const paymentIntent = await stripe.paymentIntents.create({
//                             currency: "EGP",
//                             amount: amount,
//                             automatic_payment_methods: { enabled: true },
//                           });  res.send({
//                             clientSecret: paymentIntent.client_secret,
//                           });
//                           appointment.paid = true;
//                           await appointment.save();
//                         }

//                         } catch (e) {
//                           return res.status(400).send({
//                             error: {
//                               message: e.message,
//                             },
//                           });
//                         }       }     
//               } catch (error) {
//                 // Handle errors, log them, and return an error response
//                 res.status(500).json({ error: 'An error occurred while processing payment' });
//               }
//             });


    // patient view my wallet
    app.get('/wallet-balance/:username', async (req, res) => {
      try{
       const username = req.params.username;
        const patient = await PatientsModel.findOne({ username: logged.username });
    
      if (patient) {
        res.json({ walletBalance: patient.walletBalance });
      } else {
        res.status(404).json({ error: 'Patient not found' });
      }
    }
    catch (err) {
      console.log(err);
    }
    });


// doctor view my wallet
    app.get('/doc-wallet-balance/:username', async (req, res) => {
      try{
        const username = req.params.username;
        const doctor = await DoctorsModel.findOne({ username: logged.username });
    
      if (doctor) {
        res.json({ walletBalance: doctor.walletBalance });
      } else {
        res.status(404).json({ error: 'doc not found' });
      }
    }
    catch (err) {
      console.log(err);
    }
    });
   
// as a doctor add my available time slots for appointments req(17)
    app.post('/addTimeSlots', async (req, res) => {
      const { doctorId, timeSlots } = req.body;
    
      try {
        const doctor = await DoctorsModel.findById(doctorId);
    
        if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
    
        if (!doctor.isEmployed) {
          return res.status(403).json({ message: 'Doctor is not employed yet' });
        }
    
        
        doctor.availableSlots = timeSlots;
    
        await doctor.save();
    
        res.json({ message: 'Time slots added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }


// as a patient view all available appointments of a selected doctor (42)
      app.get('/appointments/:doctorId', async (req, res) => {
        const { doctorId } = req.params;
      
        try {
          const doctor = await DoctorsModel.findById(doctorId);
      
          if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
          }
      
          const availableAppointments = doctor.availableSlots; 
      
          res.json(availableAppointments);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      });  


      // select an appointment date and time for myself or for a family member (43)
      app.post('/checkAppointmentAvailability', async (req, res) => {
        const { doctorId, selectedDate, selectedTime, isForFamilyMember } = req.body;
      
        try {
          const doctor = await Doctor.findById(doctorId);
      
          if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
          }
      
          const availableTimeSlots = doctor.availableSlots;
      
          const isDateAvailable = availableTimeSlots.some(slot => slot.date === selectedDate);
      
          if (!isDateAvailable) {
            return res.json({ message: 'Selected date is not available' });
          }
      
          let availableTimesForSelectedDate;
      
          if (isForFamilyMember) {
            
            availableTimesForSelectedDate = availableTimeSlots.find(slot => slot.date === selectedDate).times;
          } else {
            
            availableTimesForSelectedDate = availableTimeSlots.find(slot => slot.date === selectedDate && slot.times.includes(selectedTime));
      
          }
      
          const isTimeAvailable = availableTimesForSelectedDate && availableTimesForSelectedDate.includes(selectedTime);
      
          if (isTimeAvailable) {
            res.json({ message: 'Appointment is available' });
          } else {
            res.json({ message: 'Selected time is not available' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: error.message });
        }
      });
      

      
      
    });

   // schedule a follow-up for a patient (51)
   app.post('/scheduleFollowUp', async (req, res) => {
    const { patientName, followUpDate, followUpTime, purpose } = req.body;
  
    try {
      const patient = await PatientsModel.findOne({ name: patientName });
  
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      const followUp = new FollowUpModel({
        patientId: patient._id,
        followUpDate,
        followUpTime,
        purpose,
      });
  
      await followUp.save();
  
      res.json({ message: 'Follow-up scheduled successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
    
    

    



  app.listen(3001,'localhost')