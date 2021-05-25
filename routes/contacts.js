const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// CRUD route - Create, Read, Update, Delete

// @route    GET api/contacts
// @desc     Get all user contacts
// @access   Private
// If you want the url to be protected, add a second parameter - auth
router.get('/', auth, async (req, res) => {
    try {
        const contacts =  await Contact.find({ user: req.user.id }).sort({ date: -1 }); // most recent is the first
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/contacts
// @desc     Update contact
// @access   Private
router.post('/', [auth, [
    check('name', 'Name is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;
    try {
        const newContact = new Contact ({
            name,
            email,
            phone, 
            type,
            user: req.user.id // comes from the auth middleware.
        });

        const contact = await newContact.save(); // puts into the DB
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/contacts/:id
// @desc     Get all user contacts
// @access   Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, type } = req.body;

    // Build contact object
    const contactFields = {}
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, 
            { $set: contactFields },
            { new: true }); // if that contact doesn't exist, create it.
        
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/contacts/:id
// @desc     Delete contact
// @access   Private
router.delete('/:id', auth, async (req, res) => {
    
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Make sure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndRemove(req.params.id)
        
        res.json({ msg: 'Contact removed '});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// must export the router:
module.exports = router;