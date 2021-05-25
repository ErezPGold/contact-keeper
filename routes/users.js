const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route    POST api/users
// @desc     Register a user
// @access   Public 

// if the url is /api/users forwarded to this file:
router.post(
    '/', 
    [
        check('name', 'Please add name').not().isEmpty(), 
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password', 
            'Please enter a password with 6 or more characters'
            ).isLength({ min:6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body; 
        try {
            let user = await User.findOne({ email: email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists'});
            }
            // if user doesn't exist yet
            user = new User({
                name,
                email,
                password
            });

            // hash the password 10 rounds (the default)
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            // send to the DB:
            await user.save();

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
    }
);

// express validator - limit the scope of what can be set

// must export the router:
module.exports = router;