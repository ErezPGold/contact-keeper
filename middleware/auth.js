// middleware is a function that has access to request - response cycle.
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
        // 401 - not autherized
    }
    // if there is a token, we need to authorize it:
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next(); // move on 
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
}