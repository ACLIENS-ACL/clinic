// users.js
const mongoose = require('mongoose');

const pharmacyUsersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthday: String,
  gender: String,
  emailAddress: String,
  phoneNumber: String,
});

const pharmacyUserModel = mongoose.model('pharmacyUsers', pharmacyUsersSchema);
module.exports = pharmacyUserModel;
