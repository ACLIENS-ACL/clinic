const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  package: {
    type: String,
    enum: ['Silver', 'Gold', 'Platinum'],
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  doctorSessionDiscount: {
    type: Number,
    required: true
  },
  medicinesDiscount: {
    type: Number,
    required: true
  },
  familyMemberDiscount: {
    type: Number,
    required: true
  }
});

const UserModel = mongoose.model('packages', UsersSchema);
module.exports = UserModel;
