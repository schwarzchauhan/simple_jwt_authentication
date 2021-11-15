const jwt = require("jsonwebtoken");
const User = require('../model/user');

const config = process.env;

const verifyToken = async(req, res, next) => {
    console.log(req.cookies);
    // const token =
    //     req.body.token || req.query.token || req.headers["x-access-token"];
    const token = req.cookies.jwt;
    // console.log(token);

    if (!token) {
        // return res.status(403).send("Your session expired, please login again!!!");
        return res.status(403).render('login');
    }
    try {
        // https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        const decoded = jwt.verify(token, config.JWT_KEY);
        console.log('decoded');
        console.log(decoded);

        console.log('jwt token will expire on : ', new Date(decoded.exp * 1000));

        const u = await User.findOne({ _id: decoded._id });
        req.user = u;

        // req.user = decoded;
    } catch (err) {
        console.log("Your session expired, please login again!!!");
        // return console.log(err);
        return res.status(401).render('login');
    }
    return next();
};

module.exports = verifyToken;