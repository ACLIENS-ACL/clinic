const mongoose = require('mongoose');

const PatientsSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  gender: String,
  mobileNumber: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  userType: {
    type: String,
    default: 'patient', // Set the default user type to 'patient'
  },
});

const PatientsModel = mongoose.model('patients', PatientsSchema);
module.exports = PatientsModel;
