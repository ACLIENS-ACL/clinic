const mongoose = require('mongoose');

const PatientsSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: Date,
  gender: String,
  mobileNumber: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  walletBalance:{
    type: Number,
          default: 0,

  },
  familyMembers: {
    type: [
      {
        name: String,
        nationalID: String,
        age: Number,
        gender: String,
        relation: String,
        subscribedPackage: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'packages',
          default: null,
        },
        subscriptionDate: {
          type: Date,
          default: null,
        },
        canceled: {
          type: Date,
          default: null,
        },
         
      }
    ],
    default: [], // Default to an empty array
  },
  healthRecords: {
    type: [String], // Array of strings for health records
    default: [], // Default to an empty array
  },
  subscribedPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'packages',
    default: null,
  },
  subscriptionDate: {
    type: Date,
    default: null,
  },
  canceled: {
    type: Date,
    default: null,
  },
    
  userType: {
    type: String,
    default: 'patient',
  },
});

const PatientsModel = mongoose.model('patients', PatientsSchema);
module.exports = PatientsModel;
