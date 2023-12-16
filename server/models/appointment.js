const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true,
  },
  cost:{
    type:Number,
    default:0.0
  },
  familyMember:{
    type: {
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients',
        default: null,
      },
      name: String,
      nationalID: String,
      age: Number,
      gender: String,
      relation: String,
      healthRecords: {
        type: [Object], // Array of strings for health records
        default: [], // Default to an empty array
      }   
    },
    default:null
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
  type:{
    type:String,
    default: "new"
  },
  followedUp: {
    type: Boolean,
    default: false,
  },
  // Add the 'cancelled' boolean attribute with default false
  cancelled: {
    type: Boolean,
    default: false,
  },
  prescribed:{
    type:mongoose.Schema.Types.ObjectId,
    default:null,
  }
});

// Update the virtual field for 'status' to check 'cancelled' attribute
AppointmentSchema.virtual('status').get(function () {
  return this.cancelled ? 'canceled' : this.date > new Date() ? 'scheduled' : 'completed';
});

const AppointmentModel = mongoose.model('appointments', AppointmentSchema);
module.exports = AppointmentModel;
