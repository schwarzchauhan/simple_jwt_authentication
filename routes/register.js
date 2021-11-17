const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = 10;
const jwt = require('jsonwebtoken');
const User = require('../model/user');



router.route('/')

.get((req, res) => {
    res.render('register');
})

.post(async function(req, res) {
    try {
        console.log('---------/register POST');
        console.log(req.body);
        const { email, pwd } = req.body;

        // chk email, password
        if (!(email && pwd)) {
            return res.status(400).render('register', { someMsg: 'Credentials missing!' });
        }

        // chk email already exists
        const old_user = await User.findOne({ email: email });
        if (old_user) {
            return res.status(409).render('http', { imgUrl: '/pix/400a.jpg', status: '409: Conflict, User already exists' });
        }

        console.log(pwd.length);
        if (pwd.length < 8) {
            return res.status(400).render('register', { someMsg: 'Password must be of at least 8 characters!' });
        }


        // creating new user
        // https://github.com/dcodeIO/bcrypt.js#hashs-salt-callback-progresscallback
        const hash = await bcrypt.hash(pwd, salt);
        const u = await User.create({
            email: email,
            password: hash
        });

        // creating & assigning token sync-ly
        const token = jwt.sign({
            _id: u._id
        }, process.env.JWT_KEY, { expiresIn: '50s' }); // https://stackoverflow.com/questions/45207104/how-to-set-jwt-token-expiry-time-to-maximum-in-nodejs
        u.token = token;
        await u.save();
        // https://expressjs.com/en/api.html#res.cookie
        res.cookie('jwt', token);

        // sending user successfully created response
        console.log(u);
        // res.status(201).json(u);
        res.redirect('/welcome')

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;