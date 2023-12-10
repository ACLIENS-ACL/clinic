const mongoose = require('mongoose');

const PatientsSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  gender: String,
  mobileNumber: String,
  emergencyContactName: String,
  emergencyContactNumber: String,
  relationToPatient: String,
  userType: {
    type: String,
    default: 'patient', // Set the default user type to 'patient'
  },
  cart: [
    {
      medicineId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      name: String,    // Add the name of the medicine
      price: Number,   // Add the price of the medicine
    },
  ],
  deliveryAddresses: [String],
  orders: [
    {
      orderId: mongoose.Schema.Types.ObjectId, // Reference to the order
    },
  ],
  wallets:  {
    type: Number,
    default: 0, // Set the default value to 0 or any other appropriate default value
  },
});

const PatientsModel = mongoose.model('patients', PatientsSchema);
module.exports = PatientsModel;
