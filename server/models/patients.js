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
  subscribedPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'packages',
    default: null,
  },
  userType: {
    type: String,
    default: 'patient',
  },
});

const PatientsModel = mongoose.model('patients', PatientsSchema);
module.exports = PatientsModel;
