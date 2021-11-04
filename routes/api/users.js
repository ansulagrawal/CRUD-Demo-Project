const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
  check('name', 'Name is required!').not().isEmpty(),
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Enter password with min 7 or more characters').isLength({ min: 7 })
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send('User route')
  });

module.exports = router;