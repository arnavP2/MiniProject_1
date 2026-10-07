const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    // Adding location directly on product helps with $geoNear aggregation
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

