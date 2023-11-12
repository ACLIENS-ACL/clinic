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
  walletBalance:{
    type: Number,
          default: 0,

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
    enum: ['Approved', 'Rejected', 'Pending', 'Request Not Made'], // Define valid enum values
  },
  extraNotes:{
    type:String,
    default:""
  }, 
  availableSlots: {
    type: [Date],
    default: []
  },
  isEmployed: {
    type: Boolean,
    default: false
  },
});


const UserModel = mongoose.model('doctors', UsersSchema);
module.exports = UserModel;
