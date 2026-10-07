const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    artisan: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    fulfillmentMethod: {
      type: String,
      enum: ['Self-Pickup'],
      default: 'Self-Pickup',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Ready for Pickup', 'Completed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI QR', 'Cash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

