const mongoose = require('mongoose');

const FollowUpSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients', 
    required: true,
  },
  followUpDate: {
    type: Date,
    required: true,
  },
  followUpTime: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
});

const FollowUpModel = mongoose.model('followups', FollowUpSchema);
module.exports = UserModel;