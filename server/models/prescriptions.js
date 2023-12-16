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
  appointmentId:{
    type: mongoose.Types.ObjectId,
    ref: 'appointment',
    required: true,
  },
  medicines: {
    type:[{
    name:String,
    dose:{
      daily:Number,
      days:Number
    },
    pharmacy:{
      type:Boolean,
      default:true
    }
  }
  ],
    default: []
  },
  filled:{
    type:Boolean,
    default: false
  },
  fileName:{
    type: String,
    default:""
  },
  familyMmeber:{
    type:String,
    default:null
  }
  
});

const PrescriptionModel = mongoose.model('prescriptions', PrescriptionSchema);
module.exports = PrescriptionModel;
