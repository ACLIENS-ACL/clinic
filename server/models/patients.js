const mongoose = require('mongoose');

const PatientsSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: Date,
  nationalID:String,
  gender: String,
  mobileNumber: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  wallet: {
    type: Number,
    default: 0.0
  },
  familyMembers: {
    type: [
      {
        account:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'patients',
          default: null,
        },
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
        healthRecords: {
          type: [Object], // Array of strings for health records
          default: [], // Default to an empty array
        }   
      }
    ],
    default: [], // Default to an empty array
  },
  medicalHistory: [{
    fileName: String,
    filePath:Object
  }],
  default: [],
  healthRecords: {
    type: [Object], // Array of strings for health records
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
