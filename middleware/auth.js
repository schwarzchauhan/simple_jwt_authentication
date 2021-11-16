const jwt = require("jsonwebtoken");
const User = require('../model/user');

const config = process.env;

const verifyToken = async(req, res, next) => {
    console.log('----------------auth');
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

        const creation_time = new Date(decoded.iat * 1000);
        const expiry_time = new Date(decoded.exp * 1000);
        console.log('jwt token created on : ', creation_time.toLocaleString());
        console.log('jwt token will expire on : ', expiry_time.toLocaleString());

        const u = await User.findOne({ _id: decoded._id });
        req.user = u;

        // req.user = decoded;
    } catch (err) {
        console.log("Your session expired, please login again!!!");
        // return console.log(err);
        return res.status(401).render('login', { someMsg: 'session expired, please login again' });
    }
    return next();
};

module.exports = verifyToken;