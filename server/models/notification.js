const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
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
  type:{
    type:String,
    default: "new"
  }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  });


const NotificationModel = mongoose.model('notifications', NotificationSchema);
module.exports = NotificationModel;
