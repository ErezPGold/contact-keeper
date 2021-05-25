const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route    GET api/auth
// @desc     Get logged in user
// @access   Private (only the user that is logged in) 

// if the url is /api/auth forwarded to this file:
router.get('/', auth, async  (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch ( err ) {
        console.error(res.statusMessage);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/auth
// @desc     Auth user & get token 
// @access   Public

router.post('/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;

        try {
             let user = await User.findOne({ email });
             if (!user) {
                 return res.status(400).json({ msg: 'Invalid Credentials (email)' });
             }
             // if there is a user with a match email, check the password:
             const isMatch = await bcrypt.compare(password, user.password);
             if (!isMatch) {
                 return res.status(400).json({ msg: 'Invalid Credentials (password)' });
             }
             
             const payload = {
                user: {
                    id: user.id
                }
            }

            // return a token if registration succeed
            jwt.sign(payload, config.get('jwtSecret'), 
            {
                expiresIn: 3600
            }, (err, token) => {
                if(err) throw err;
                res.json({ token });
            });

        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
});

// must export the router:
module.exports = router;