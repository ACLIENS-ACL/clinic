const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status:  {
    type: String,
    default: 'schdeuled',
    enum: ['scheduled', 'cancelled', 'completed'],
    required: true,
  },
});

const AppointmentModel = mongoose.model('appointments', AppointmentSchema);
module.exports = AppointmentModel;
