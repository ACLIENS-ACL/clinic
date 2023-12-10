// Import necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./pharmacyModels/patients');
const PharmacistsModel = require('./pharmacyModels/pharmacists');
const AdminsModel = require('./pharmacyModels/admins');
const MedicineModel = require('./pharmacyModels/medicines');
const OrderModel = require('./pharmacyModels/order');
var session = require("express-session");
const jwt = require('jsonwebtoken');

const secretKey = 'random';


const multer = require('multer');
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
app.use(cors());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "anyrandomstring",
  })
);
const MongoURI = 'mongodb://localhost:27017/pharmacy' ;

mongoose.connect(MongoURI);
var logged = {
  username: "",
  in: "",
  type: ""
};
loggedinusername = "";


app.get('/editmed', verifyToken, async (req, res) => {
  res.json(logged);
})
app.get('/admin', verifyToken, async (req, res) => {
  res.json(logged);
})
app.get('/pharma', verifyToken, async (req, res) => {
  const Pharmacist = await PharmacistsModel.findOne({ username:req.user.username });
  const logged2={logged:logged,medicines:Pharmacist.medicines}
  res.json(logged2);
})
var loggedd = {
  username: "",
  password: ""
};
app.get('/adminadmin', verifyToken, async (req, res) => {
  res.json(loggedd);
})


app.get('/pharmacist', verifyToken, async (req, res) => {
  res.json(logged);
})

app.get('/patient', verifyToken, async (req, res) => {
  res.json(logged);
})

app.get('/typeformed', verifyToken, async (req, res) => {
  res.json(logged);
})

app.get('/logout', verifyToken, async (req, res) => {
  req.user.username = ""
  req.user.type = ""
  res.json(logged);
})

app.get('/getType',  async (req, res) => {
  console.log("hii")
  const { username } = req.query;
  if (username.toLowerCase() == "admin") {
    return res.json({ userType: 'admin' });
  }
  try {
    // Check in PharmacistsModel
    const Pharmacist = await PharmacistsModel.findOne({ username });
    if (Pharmacist) {
      return res.json({ userType: 'pharmacist' });
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


app.post('/register-patient', async (req, res) => {
  const patientData = req.body;
  try {
    if(patientData.username==="admin"){
      res.status(400).json({ error: 'Username already exists' });
    }
    // Check if a user with the same username already exists
    const existingPatient = await PatientsModel.findOne({ username: patientData.username });
    const existingP = await PharmacistsModel.findOne({ username: patientData.username });
    const existingPa = await AdminsModel.findOne({ username: patientData.username });
    const existingPatiente = await PatientsModel.findOne({ email: patientData.email });
    const existingPe = await PharmacistsModel.findOne({ email: patientData.email });
    const existingPae = await AdminsModel.findOne({ email: patientData.email });

    if (existingPatient || existingP || existingPa) {
      res.status(400).json({ error: 'Username already exists' });
    }
    else if (existingPatiente || existingPe || existingPae) {
      res.status(400).json({ error: 'Email already registered to another user' });
    } else {
      const patient = await PatientsModel.create(patientData);
      res.json(patient);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// Register route for pharmacists
app.post('/register-pharmacist', async (req, res) => {
  const pharmacistData = req.body;
  req.user.username = pharmacistData.username;
  try {
    if(pharmacistData.username==="admin"){
      res.status(400).json({ error: 'Username already exists, Please Chose a unique username' });
    }
    // Check if a user with the same username already exists
    const existingPharmacist = await PharmacistsModel.findOne({ username: pharmacistData.username });
    const existingPatient = await PatientsModel.findOne({ username: pharmacistData.username });
    const existingPa = await AdminsModel.findOne({ username: pharmacistData.username });
    const existingPatiente = await PatientsModel.findOne({ email: pharmacistData.email });
    const existingPe = await PharmacistsModel.findOne({ email: pharmacistData.email });
    const existingPae = await AdminsModel.findOne({ email: pharmacistData.email });

    if (existingPharmacist || existingPatient || existingPa) {
      res.status(400).json({ error: 'Username already exists, Please Chose a unique username' });
    }
    else if (existingPatiente || existingPe || existingPae) {
      res.status(400).json({ error: 'Email already registered to another user' });
    } else {
      const pharmacist = await PharmacistsModel.create(pharmacistData);
      res.json(pharmacist);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post('/login-pharmacist', (req, res) => {
  const { username, password } = req.body;
  req.user.username = username;
  logged.in = true;
  req.user.type = "pharmacist"

  if (req.user.type !== "pharmacist") {
    res.json("Success");
    req.session.loggedIn = true;
    req.session.user = "pharmacist";
    req.session.save();
  }
  else {
    PharmacistsModel.findOne({ username: username })
      .then(user => {
        if (user) {
          if (user.password === password) {
            const token = jwt.sign({ username: user.username, type: 'pharmacist' }, secretKey, { expiresIn: '1h' });
            if (user.enrolled !== "accepted") {
              res.json({ message: "Success But Not Enrolled", enrolledStatus: user.enrolled,token });
            } else {
              res.json({ message: "Success" , token });
            }
            // Store the token securely on the client side (using localStorage)
            req.session.loggedIn = true;
            req.session.user = "pharmacist";
            req.session.save();
          } else {
            res.json({ message: "Password incorrect"});
          }
        } else {
          res.json({ message: "Username isn't registered"});
        }
      })
      .catch(err => res.status(400).json(err));
  }
});
function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

app.get('/get-pharmacist-info', verifyToken, async (req, res) => {
  try {
    const pharmacistInfo = await PharmacistsModel.findOne({ username: req.user.username });
    res.json(pharmacistInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching pharmacist info.' });
  }
});

app.put('/update-pharmacist-info', verifyToken, async (req, res) => {
  try {
    await PharmacistsModel.updateOne({ username: req.body.username }, req.body);
    res.json({ message: 'pharmacist info updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating pharmacist info.' });
  }
});

app.post('/login-patient', (req, res) => {
  const { username, password } = req.body;
  req.user.username = username;
  logged.in = true;
  req.user.type = "patient"
  PatientsModel.findOne({ username: username })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign({ username: user.username, type: 'patient' }, secretKey, { expiresIn: '1h' });
    
          res.json({ message: 'Success', token });
          loggedinusername = username;
          req.session.loggedIn = true;
          req.session.user = "patient";
          req.session.save();
        } else {
          res.json({ message: "Password incorrect"});
        }
      } else {
        res.json({ message: "Username isn't registered" });
      }
    })
    .catch(err => res.status(400).json(err));


});

app.post('/login-admin', (req, res) => {
    const {username, password} = req.body;
    console.log(username)
    loggedd.username=username
    loggedd.password=password
    if(username.toLowerCase()==="admin"&&password=="admin"){
      const token = jwt.sign({ username: "admin", type: 'admin' }, 'random');
      console.log(token)
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
              res.json({ message: "Password incorrect" });
            }
          } else {
            res.json({ message: "Username isn't registered" });
          }
        })
  }});

app.get('/register-admin', verifyToken, async (req, res) => {
  res.json(logged);
})
app.post('/register-admin', verifyToken, async (req, res) => {
  try {
    const adminData = req.body;
    if(adminData.username==="admin"){
      return res.json({ message: 'Username already exists' });
    }
    const existingAdmin = await AdminsModel.findOne({ username: adminData.username });
    const existingPharmacist = await PharmacistsModel.findOne({ username: adminData.username });
    const existingPatient = await PatientsModel.findOne({ username: adminData.username });
    const existingPatiente = await PatientsModel.findOne({ email: adminData.email });
    const existingPe = await PharmacistsModel.findOne({ email: adminData.email });
    const existingPae = await AdminsModel.findOne({ email: adminData.email });

    if (existingAdmin || existingPatient || existingPharmacist) {
      return res.json({ message: 'Username already exists' });
    }
    else if (existingPatiente || existingPe || existingPae) {
      return res.json({ message: 'Email already registered to another user' });
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

// Server-side route to fetch pharmacist requests
app.get('/pharmacist-requests', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all pharmacists with "enrolled" set to false
    const PharmacistRequests = await PharmacistsModel.find({ enrolled: "pending" });
    type = req.user.type
    responseData.pharmacistRequests = PharmacistRequests
    res.json(responseData);
  } catch (error) {
    console.error("error");
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route to approve a pharmacist
app.post('/approve-pharmacist/:id', verifyToken, async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    // Update the pharmacist's "enrolled" status to true
    await PharmacistsModel.findByIdAndUpdate(pharmacistId, { enrolled: "accepted" });

    res.json({ message: 'pharmacist approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route to reject and remove a pharmacist
app.post('/reject-pharmacist/:id', verifyToken, async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    // Remove the pharmacist from the database
    const deletedPharmacist = await PharmacistsModel.findOneAndRemove({ _id: pharmacistId });

    if (deletedPharmacist) {
      res.json({ message: 'Pharmacist rejected and removed successfully' });
    } else {
      res.status(404).json({ message: 'Pharmacist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route to reject and remove a pharmacist
app.get('/remove-pharmacist', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all pharmacists with "enrolled" set to false
    const pharmacistRequests = await PharmacistsModel.find({});
    responseData.pharmacistRequests = pharmacistRequests
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/remove-pharmacist/:id', verifyToken, async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    // Remove the pharmacist from the database
    await PharmacistsModel.findByIdAndRemove(pharmacistId);

    res.json({ message: 'Pharmacist rejected and removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Server-side route to reject and remove a patient
app.get('/remove-patient', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all patients with "enrolled" set to false
    const patientRequests = await PatientsModel.find({});
    responseData.patientRequests = patientRequests
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/remove-patient/:id', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;

    // Remove the patient from the database
    await PatientsModel.findByIdAndRemove(patientId);

    res.json({ message: 'patient removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/view-pharmacist', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    const viewPharmacist = await PharmacistsModel.find({});
    responseData.pharmacistRequests = viewPharmacist
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/view-pharmacist/:id', verifyToken, async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    await PharmacistsModel.findByIdAndRemove(pharmacistId);

    res.json({ message: 'pharmacist found successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/view-patient', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    const viewPatient = await PatientsModel.find({});
    responseData.patientRequests = viewPatient
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/view-patient/:id', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;

    await PatientsModel.findByIdAndRemove(patientId);

    res.json({ message: 'patient found successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3002, 'localhost');

app.get('/medicines/:name', async (req, res) => {
  try {
    // Get the medicine name from the request parameters
    const { name } = req.params;
    const medicine = await MedicineModel.findOne({ name });
    if(medicine){
      res.json({_id:medicine._id, name: medicine.name, quantity: 1, price:medicine.price, available: medicine.quantity, fileName:medicine.imageUrl.fileName});
    } else {
      // Otherwise, return a 404 status code with an error message
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal sserver error' });
  }
});
// Server-side route to update a medicine by ID// Server-side route to update a medicine by name
app.put('/medicines/:name', verifyToken, async (req, res) => {
  try {
    // Get the medicine name from the request parameters
    const { name } = req.params;

    // Get the updated medicine data from the request body
    const { Nname, activeIngredients, medicinalUse, price, quantity, sales, imageUrl } = req.body;
    // Find the medicine in the database by name
    const medicine = await MedicineModel.findOne({ name });

    if (medicine) {
      // If the medicine is found, update its attributes
      medicine.name = Nname || medicine.name;
      medicine.activeIngredients = activeIngredients || medicine.activeIngredients;
      medicine.medicinalUse = medicinalUse || medicine.medicinalUse;
      medicine.price = price || medicine.price;
      medicine.quantity = quantity || medicine.quantity;
      medicine.sales = sales || medicine.sales;
      medicine.imageUrl = imageUrl || medicine.imageUrl;

      await medicine.save();

      // Return a success response
      res.json({ message: 'Medicine updated successfully' });
    } else {
      // Otherwise, return a 404 status code with an error message
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal sserver error' });
  }
});


// filter medicines by medicinalUse
app.get('/filter-medicines', verifyToken, async (req, res) => {
  try {
    // Get the medicinalUse from the request query parameters
    const { medicinalUse } = req.query;

    // Find all medicines that match the medicinalUse
    const medicines = await MedicineModel.find({ medicinalUse });

    // Return the matched medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/medicinal-uses', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    medicinalUses: [],
    userType: type,
    sessi: sess
  }
  try {
    const medicinalUses = await MedicineModel.distinct('medicinalUse');
    responseData.medicinalUses = medicinalUses
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Define the route for adding medicine with file upload
app.post('/add-medicine', upload.single('image'), async (req, res) => {
  try {
    // Get the medicine data from the request body
    const { name, activeIngredients, medicinalUse, price, quantity, isPrescriptionRequired, description } = req.body;

    // Get the file information from the request
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Create a new medicine object
    const newMedicine = new MedicineModel({
      name,
      activeIngredients,
      medicinalUse,
      price,
      quantity,
      imageUrl: { fileName: filename, filePath },
      isPrescriptionRequired,
      description,
    });

    // Save the new medicine to the database
    await newMedicine.save();

    const pharmacist = await PharmacistsModel.findOne({ username: req.user.username });
    if (pharmacist) {
      pharmacist.medicines.push(newMedicine._id);
      await pharmacist.save();
    }

    // Return a success response
    res.json({ message: 'Medicine added successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// to search for a medicine
app.get('/search-medicine', verifyToken, async (req, res) => {
  try {
    // Get the search query from the request query parameters
    const { searchQuery } = req.query;

    // Find all medicines that match the search query
    const medicines = await MedicineModel.find({
      name: { $regex: searchQuery, $options: 'i' },
    });

    // Return the matched medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internall server error' });
  }
});

// Server-side route to view a list of all available medicines in the database
app.get('/medicines', verifyToken, async (req, res) => {
  try {
    // Find all medicines in the database
    const medicines = await MedicineModel.find({});
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/medicinespharmacist', verifyToken, async (req, res) => {
  try {
    // Find all medicines in the database
    const medicines = await MedicineModel.find({});

    // Return the medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//SPRINT 2
app.post('/patient/:id/cart', verifyToken, async (req, res) => {
  const patientId = req.params.id;
  const { cart } = req.body;

  try {
    await PatientsModel.updateOne({ _id: patientId }, { cart: cart });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating pharmacist info.' });
  }
});
app.get('/current-user', verifyToken, async (req, res) => {
  // Assuming the user's username is passed in the request.
  const username = loggedinusername;
  try {
    const existingPatient = await PatientsModel.findOne({ username: username });
    res.json(existingPatient);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

app.get('/view-cart', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    const viewPatient = await PatientsModel.findOne({ username: req.user.username });
    responseData.patientRequests = viewPatient
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/remove-item', verifyToken, async (req, res) => {
  const { cart } = req.body;
  const username = req.user.username;
  try {
    await PatientsModel.updateOne({ username: username }, { cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/update-quantity', verifyToken, async (req, res) => {
  const { cart } = req.body;
  const username = req.user.username;
  try {
    await PatientsModel.updateOne({ username: username }, { cart: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/change-password', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    var viewPatient;
    if (responseData.userType == 'admin') {
      viewPatient = await AdminsModel.findOne({ username: req.user.username });
    }
    else if (responseData.userType == 'pharmacist') {
      viewPatient = await PharmacistsModel.findOne({ username: req.user.username });
    }
    else {
      viewPatient = await PatientsModel.findOne({ username: req.user.username });
    }
    responseData.patientRequests = viewPatient
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/update-password', verifyToken, async (req, res) => {
  const { password } = req.body;
  const username = req.user.username;
  try {
    if (req.user.type == 'admin') {
      await AdminsModel.updateOne({ username: username }, { password: password });
    }
    else if (req.user.type == 'pharmacist') {
      await PharmacistsModel.updateOne({ username: username }, { password: password });
    }
    else {
      await PatientsModel.updateOne({ username: username }, { password: password });
    }
    res.json({ message: 'Password Updated Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.get('/delivery-addresses', verifyToken, async (req, res) => {
  var sess = logged.in
  var type = req.user.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }

  try {
    const viewPatient = await PatientsModel.find({ username: req.user.username })
    responseData.patientRequests = viewPatient
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/add-address', verifyToken, async (req, res) => {
  try {
    const { addresses } = req.body;
    const patient = await PatientsModel.findOne({ username: req.user.username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Merge the new address with the existing addresses
    patient.deliveryAddresses = [ ...addresses];

    await patient.save();
    res.json({ message: 'Addresses updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/place-order', verifyToken, async (req, res) => {
  try {
    // Get order data from the request body
    const { cart, deliveryAddress, paymentMethod } = req.body;
    // You can add the username from the authenticated user if available

    if (!cart || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing order data' });
    }

    // You can add the username from the authenticated user if available
    const username = req.user.username; // Replace with the actual username or user identification logic

    // Check if the user (patient) exists
    const patient = await PatientsModel.findOne({ username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Extract the selected items from the cart for the order
    const items = cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate the total
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create a new order
    const order = new OrderModel({
      patientName: username, // You can associate the order with the patient's ID
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });

    // Save the order to the database
    await order.save();

    // You may want to update other information like the patient's order history
    // For example, you can add this order to the patient's order history array

    await patient.save();
    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Backend code to get a user's orders
app.get('/user-orders', verifyToken, async (req, res) => {
  try {
    const username = req.user.username; // You can extract the username from the request query

    // Find the user's orders based on the username
    const orders = await OrderModel.find({ patientName: username });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/cancel-order/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by its ID
    const order = await OrderModel.findByIdAndRemove(orderId);
    const cart = order.items
    for (const item of cart) {
      const { name, quantity } = item;
      // Find the medicine in the database by ID
      const medicine = await MedicineModel.findOne({ name: name });

      if (medicine) {
        // Update the medicine's quantity
        const updatedQuantity = medicine.quantity + quantity;
        medicine.quantity = updatedQuantity >= 0 ? updatedQuantity : 0;

        // Save the updated medicine
        await medicine.save();
      }
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order canceled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/wallet-balance', verifyToken, async (req, res) => {
  try {
    // Assuming the user is authenticated and you have the user's ID in the request
    const userId = req.user.username; // Adjust this based on your authentication logic
    const user = await PatientsModel.find({ username: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ balance: user[0].wallets });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update-wallet-balance', verifyToken, async (req, res) => {
  try {
    const userId = req.user.username; // Adjust this based on your authentication logic
    const { balance } = req.body;

    const user = await PatientsModel.updateOne({ username: userId }, { wallets: balance });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/add-to-cart/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by its ID
    const order = await OrderModel.findById(orderId);
    const cart = order.items
    for (const item of cart) {
      const { name, quantity } = item;
      // Find the medicine in the database by ID
      const medicine = await MedicineModel.findOne({ name: name });

      if (medicine) {
        // Update the medicine's quantity
        const updatedQuantity = medicine.quantity + quantity;
        medicine.quantity = updatedQuantity >= 0 ? updatedQuantity : 0;

        // Save the updated medicine
        await medicine.save();
      }
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order status is "Processing" and can be added back to the cart
    if (order.status === 'Processing') {
      // Retrieve the items from the order
      const items = order.items;

      // Find the user (patient) by username (you should replace this with actual authentication logic)
      const patient = await PatientsModel.findOne({ username: order.patientName });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Add the items back to the user's cart in the database
      patient.cart.push(...items);

      // Save the updated patient document
      await patient.save();
      await OrderModel.findByIdAndRemove(orderId);

      // Send a success response
      return res.json({ message: 'Order added back to the cart successfully' });
    } else {
      return res.status(400).json({ message: 'Order cannot be added back to the cart or status is not "Processing"' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/update-medicine-quantities', verifyToken, async (req, res) => {
  try {
    // Assuming you pass the user's ID in the request body
    const userId = req.user.username;

    // Find the user in the database
    const user = await PatientsModel.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the user's cart from the database
    const cart = user.cart;

    // Iterate through each item in the cart and update the quantity in the medicine database
    for (const item of cart) {
      const { name, quantity } = item;

      // Find the medicine in the database by ID
      const medicine = await MedicineModel.findOne({ name: name });

      if (medicine) {
        // Update the medicine's quantity
        const updatedQuantity = medicine.quantity - quantity;
        medicine.quantity = updatedQuantity >= 0 ? updatedQuantity : 0;

        // Save the updated medicine
        await medicine.save();
      }
    }
    user.cart = []
    await user.save();
    res.json({ message: 'Medicine quantities updated successfully' });
  } catch (error) {
    console.error('Error updating medicine quantities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const nodemailer = require('nodemailer');

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
      console.log('Email sent: ' + info.response);
    }
  });
};
const otpStorage = {};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

app.post('/send-otp',  async (req, res) => {
  const { username } = req.body;
  let email;
  let userType;
  let userModel;
  if (username) {
    const patient = await PatientsModel.findOne({ email: username });
    if (patient) {
      email = patient.email;
      userType = 'patient';
      userModel = PatientsModel;
      req.user.type = "patient";
    } else {
      const admin = await AdminsModel.findOne({ email: username });
      if (admin) {
        email = admin.email;
        userType = 'admin';
        userModel = AdminsModel;
        req.user.type = "admin";
      } else {
        const pharmacist = await PharmacistsModel.findOne({ email: username });
        if (pharmacist) {
          email = pharmacist.email;
          userType = 'pharmacist';
          userModel = PharmacistsModel;
          req.user.type = "pharmacist";
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
app.post('/verify-otp',  (req, res) => {
  const { username, otp } = req.body;
  console.log("Entered:: ", otp);
  // Get the stored OTP
  const storedOTP = otpStorage[username];
  console.log("Entered:: ", storedOTP.toString());

  if (!storedOTP.toString() || storedOTP.toString() !== otp) {
    res.status(400).json({ message: 'Invalid OTP' });
  } else {
    res.status(200).json({ message: 'OTP verified successfully' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    let patient = await PatientsModel.updateOne({ email: email }, { password: password });
    // If the user is not found in PatientsModel, check in PharmacistsModel
    if (patient.modifiedCount === 0) {
      patient = await PharmacistsModel.updateOne({ email: email }, { password: password });

      // If the user is not found in PharmacistsModel, check in AdminsModel
      if (patient.modifiedCount === 0) {
        await AdminsModel.updateOne({ email: email }, { password: password });

        // If the user is not found in any of the databases, return a message
        if (patient.modifiedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/upload-id-document/:username', upload.single('idDocument'), verifyToken, (req, res) => {
  const username = req.params.username;
  const idDocument = req.file;
  // Check if a patient with the given username exists in the PatientsModel
  PharmacistsModel.findOne({ username: username })
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

app.post('/upload-medical-licenses/:username', upload.array('medicalLicenses', 5), verifyToken, (req, res) => {
  const username = req.params.username;
  const medicalLicenses = req.files;
  // Check if a pharmacist with the given username exists in the pharmacistsModel
  PharmacistsModel.findOne({ username: username })
    .then(existingpharmacist => {
      if (!existingpharmacist) {
        return res.status(404).json({ message: 'pharmacist not found' });
      }

      // Process and update the medical licenses for the pharmacist
      // You can use the "existingpharmacist" to identify the pharmacist and update their information in the database.
      const medicalLicensesData = medicalLicenses.map(file => ({
        fileName: file ? file.filename : '',
        filePath: file ? file.path : '',
      }));

      existingpharmacist.medicalLicenses = medicalLicensesData;

      // Save the updated pharmacist information to the database
      existingpharmacist.save()
        .then(updatedpharmacist => res.json(updatedpharmacist))
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
});

app.post('/upload-medical-degree/:username', upload.single('medicalDegree'), verifyToken, (req, res) => {
  const username = req.params.username;
  const medicalDegree = req.file;

  // Check if a patient with the given username exists in the PatientsModel
  PharmacistsModel.findOne({ username: username })
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


app.post('/place-order-clinic', async (req, res) => {
  const { medicines, address, total, method, name } = req.body;

  try {
    // Create order items from the provided medicines
    const orderItems = medicines.map(async medicine => {
      const { _id, quantity } = medicine;

      // Update the quantity and sales for each medicine
      await MedicineModel.findByIdAndUpdate(
        _id,
        {
          $inc: { quantity: -quantity, sales: quantity },
        }
      );

      return {
        _id,
        quantity,
        name: medicine.name,
        price: medicine.price,
      };
    });

    // Wait for all the updates to complete
    const updatedOrderItems = await Promise.all(orderItems);
    const newOrder = new OrderModel({
      patientName: name,
      items: updatedOrderItems,
      totalAmount: total,
      deliveryAddress: address,
      paymentMethod: method,
    });

    // Save the order to the database
    await newOrder.save();

    // Send a success response
    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: 'Error placing order' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

