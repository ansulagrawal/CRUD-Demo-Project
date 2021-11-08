const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  pname: {
    type: String,
    required: true,
    unique: true
  },
  pprice: {
    type: Number,
    required: true
  },
  pdescription: {
    type: String
  },
  dateofmanufacture: {
    type: Date,
    required: true
  },
  pstocks: {
    type: Number,
    required: true,
  },
  pimage: {
    type: String,
  },
  pdate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Product = mongoose.model('product', ProductSchema);