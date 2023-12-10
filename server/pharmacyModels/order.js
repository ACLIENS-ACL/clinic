const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  patientName: String, // Reference to the patient who placed the order
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [ 'Processing', 'Shipped', 'Delivered'],
    default: 'Processing',
  },
  items: [
    {
      medicineId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      name: String,
      price: Number,
    },
  ],
  totalAmount: Number,
  deliveryAddress: String,
  paymentMethod: String,
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
