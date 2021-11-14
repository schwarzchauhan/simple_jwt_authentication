const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        const decoded = jwt.verify(token, config.JWT_KEY);
        console.log('decoded');
        console.log(decoded);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;