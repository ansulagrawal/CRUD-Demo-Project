const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const request = require('request');
const config = require('config');
const { response } = require('express');

// Product Modal
const Product = require('../../models/Product');

// @route   POST api/post
// @desc    Add New Product
// @access  Public
router.get('/', [
  check('name', 'Name is required!').notEmpty(),
  check('price', 'Price required!').notEmpty().isNumeric(),
  check('dateofmanufacture', 'dateof manufacture required!').notEmpty().isDate(),
  check('stocks', 'Stocks count required').notEmpty().isNumeric()
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, price, description, stocks, dateofmanufacture } = req.body;

    // See if Product exits:
    if (name) {
      return res.status(400).json({ errors: [{ msg: 'Product Name already exits' }] })
    }

    product = new Product({
      name,
      price,
      description,
      stocks,
      dateofmanufacture
    })

    // Save the product to the database
    await product.save();
  }
);

module.exports = router;