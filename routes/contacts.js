const express = require('express');
const router = express.Router();

// CRUD route - Create, Read, Update, Delete

// @route    GET api/contacts
// @desc     Get all user contacts
// @access   Private
router.get('/', (req, res) => {
    res.send('Get all contacts');
});

// @route    POST api/contacts
// @desc     Update contact
// @access   Private
router.post('/', (req, res) => {
    res.send('Add contact');
});

// @route    PUT api/contacts/:id
// @desc     Get all user contacts
// @access   Private
router.put('/:id', (req, res) => {
    res.send('Update contact');
});

// @route    DELETE api/contacts/:id
// @desc     Delete contact
// @access   Private
router.delete('/:id', (req, res) => {
    res.send('Delete contact');
});

// must export the router:
module.exports = router;