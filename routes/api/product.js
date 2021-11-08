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


// 1.
// @route   POST api/product
// @desc    Add New Product
// @access  Public
router.post('/', [
  check('pname', 'Name is required!').notEmpty(),
  check('pprice', 'Price required!').notEmpty().isNumeric(),
  check('dateofmanufacture', 'dateof manufacture required!').notEmpty(),
  check('pstocks', 'Stocks counts required').notEmpty().isNumeric()
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


// 2.
// @route   GET api/profile/pupdate
// @desc   Update Product details
// @access  Public
router.post('/pupdate', [
  check('pname', 'Name is required!').notEmpty(),
  check('pprice', 'Price required!').notEmpty().isNumeric(),
  check('dateofmanufacture', 'dateof manufacture required!').notEmpty(),
  check('pstocks', 'Stocks counts required').notEmpty().isNumeric()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      pname,
      pprice,
      pdescription,
      pstocks,
      dateofmanufacture,
      pimage,
      ...rest
    } = req.body;

    try {
      // Build product object as pdetails:
      const pdetails = {}
      let prod = await Product.findOne({ pname });
      // console.log(product);
      if (prod._id) pdetails._id = prod._id;
      if (pprice) pdetails.pprice = pprice;
      if (pdescription) pdetails.pdescription = pdescription;
      if (pstocks) pdetails.pstocks = pstocks;
      if (dateofmanufacture) pdetails.dateofmanufacture = dateofmanufacture;
      if (pimage) pdetails.pimage = pimage;

      // Update
      let product = await Product.findOne({ pname });


      // See if Product exits:
      if (product) {
        product = await Product.findOneAndUpdate(
          { product: prod },
          { $set: pdetails },
          { new: true }
        );
        return res.json(product);
      } else {
        return res.status(400).json({ msg: 'Product not found' });
      }
    }
    catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal server Error');
    }
  }
);

// 3.
// @route    GET api/product
// @desc     Get all products
// @access   Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4.
// @route    GET api/product/:id
// @desc     Get product by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});

// 5.
// @route    DELETE api/product/:id
// @desc     Delete product by ID
// @access   Public
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Internal Server Error');
  }
});