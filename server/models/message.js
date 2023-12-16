const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderType' },
    receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverType' },
    senderType: { type: String, enum: ['Doctor', 'Patient'] },
    receiverType: { type: String, enum: ['Doctor', 'Patient'] },
    content: String,
    timestamp: { type: Date, default: Date.now },})


const NotificationModel = mongoose.model('messages', NotificationSchema);
module.exports = NotificationModel;
