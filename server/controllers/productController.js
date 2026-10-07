const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Artisan
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Add artisan to req.body
  req.body.artisan = req.user.id;

  // Set location from artisan user if not provided in product payload
  if (!req.body.location && req.user.location) {
    req.body.location = req.user.location;
  }

  // Handle image upload from Cloudinary Multer
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
  }

  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Get all products (with optional geospatial search)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { lng, lat, distance = 10000 } = req.query; // default 10km

  if (lng && lat) {
    // Geospatial search using $geoNear aggregation
    const products = await Product.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          maxDistance: parseFloat(distance),
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'artisan',
          foreignField: '_id',
          as: 'artisanDetails'
        }
      },
      {
        $unwind: '$artisanDetails'
      }
    ]);
    return res.status(200).json({ success: true, count: products.length, data: products });
  }

  // Standard fetch if no coordinates
  const products = await Product.find().populate({
    path: 'artisan',
    select: 'name artisanData location'
  });
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc    Get products by current artisan
// @route   GET /api/products/me
// @access  Private/Artisan
exports.getMyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ artisan: req.user.id });
  res.status(200).json({ success: true, count: products.length, data: products });
});

