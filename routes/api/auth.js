const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route   GET api/auths
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// @route   POST api/auth
// @desc    Autenticate user and get token
// @access  Public
router.post('/', [
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password is required to enter!').exists()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // See if user does not exists:
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] })
      }

      //  Check passsword
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Return Webtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          return res.send(res.json({ token }));
        }
      );

    }
    // catch error
    catch (err) {
      console.log(err.message);
      return res.status(500).send('Internal server Error');
    }
  });
module.exports = router;