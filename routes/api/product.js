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

// @route   POST api/product
// @desc    Add New Product
// @access  Public
router.post('/', [
  check('pname', 'Name is required!').notEmpty(),
  check('pprice', 'Price required!').notEmpty().isNumeric(),
  check('dateofmanufacture', 'dateof manufacture required!').notEmpty(),
  check('pstocks', 'Stocks count required').notEmpty().isNumeric()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { pname, pprice, pdescription, pstocks, dateofmanufacture, pimage } = req.body;
    try {
      let product = await Product.findOne({ pname });

      // See if Product exits:
      if (product) {
        return res.status(400).json({ errors: [{ msg: 'Product Name already exits' }] })
      }

      product = new Product({
        pname,
        pprice,
        pdescription,
        dateofmanufacture,
        pstocks,
        pimage
      })

      // Save the product to the database
      await product.save();
      return res.send(product);
    }
    catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal server Error');
    }
  }

);

module.exports = router;