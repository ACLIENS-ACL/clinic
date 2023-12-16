const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  messages: [
    {
      sender: String,
      content: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ChatModel = mongoose.model('Chat', ChatSchema);
module.exports = ChatModel;
