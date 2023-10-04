// users.js
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthday: String,
  gender: String,
  emailAddress: String,
  phoneNumber: String,
});

const UserModel = mongoose.model('users', UsersSchema);
module.exports = UserModel;
