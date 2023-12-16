const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patientID: {
    type: mongoose.Types.ObjectId,
    ref: 'patients',
    required: true,
  },
  doctorID: {
    type: mongoose.Types.ObjectId,
    ref: 'doctors',
    required: true,
  },
  date: Date,
  medicines: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        }
      }
    ],
    default: []
  },

  paymentMethod: {
    type: String,
    enum: ['wallet', 'creditCard'], 
    required: true,
  },
});

// Define a virtual attribute for 'status'
PrescriptionSchema.virtual('status').get(function () {
  if (this.medicines.length === 0) {
    return 'unfilled';
  } else {
    return 'filled';
  }
});

const PrescriptionModel = mongoose.model('prescriptions', PrescriptionSchema);
module.exports = PrescriptionModel;
