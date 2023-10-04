const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  gender: String,
  mobileNumber: String,
  userType: {
    type: String,
    default: 'doctor', // Set the default user type to 'doctor'
  },
  hourlyRate: Number,
  affiliation: String,
  educationalBackground: String,
  enrolled: {
    type: Boolean,
    default: false,
  }
});

const UserModel = mongoose.model('doctors', UsersSchema);
module.exports = UserModel;
