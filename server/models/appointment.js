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
  
  // Add the 'cancelled' boolean attribute with default false
  cancelled: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  }

});

// Update the virtual field for 'status' to check 'cancelled' attribute
AppointmentSchema.virtual('status').get(function () {
  return this.cancelled ? 'canceled' : this.date > new Date() ? 'scheduled' : 'completed';
});

const AppointmentModel = mongoose.model('appointments', AppointmentSchema);
module.exports = AppointmentModel;
