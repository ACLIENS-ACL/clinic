const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: Date,
  gender: String,
  mobileNumber: String,
  specialty: String,
  wallet: {
    type: Number,
    defualt:0.0
  },
  userType: {
    type: String,
    default: 'doctor',
  },
  hourlyRate: Number,
  affiliation: String,
  educationalBackground: String,
  enrolled: {
    type: String,
    default: 'Request Not Made', // Set the default value to 'Request Not Made'
    enum: ['Approved','PendingContract', 'Rejected', 'Pending', 'Request Not Made'], // Define valid enum values
  },
  extraNotes:{
    type:String,
    default:""
  }, 
  availableSlots: {
    type: [Date],
    default: []
  },
  idDocument:{
    fileName: String,
    filePath:Object
  },
  medicalDegree:{
    fileName: String,
    filePath:Object
  },
  medicalLicenses: [{
    fileName: String,
    filePath:Object
  }],
  
});


const UserModel = mongoose.model('doctors', UsersSchema);
module.exports = UserModel;