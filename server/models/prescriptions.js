const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({

  patientID: {
    type: mongoose.Types.ObjectId,
    ref:'patients',
    required: true
  },
  doctorID: {
    type: mongoose.Types.ObjectId,
    ref:'doctors',
    required: true

  },
  Date: Date,
  medicines: {
    type: String,
    enum: ['Aspirin', 'Lisinopril','Metformin', 'Ibuprofen'] ,
    required: true
  },
  Status: {
    type: String,
    enum: ['filled', 'unfilled'] ,
    required: true
  }
  // diagnosis: String,
  // MedicationDetails: String

} ,{ timestamps: true }
);

const PrescriptionModel = mongoose.model('prescriptions', PrescriptionSchema);
module.exports = PrescriptionModel;