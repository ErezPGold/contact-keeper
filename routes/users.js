const express = require('express');
const router = express.Router();

// @route    POST api/users
// @desc     Register a user
// @access   Public 

// if the url is /api/user forwarded to this file:
router.post('/', (req, res) => {
    res.send('Register a user');
});


// must export the router:
module.exports = router;