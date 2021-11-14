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
        console.log(req.body);
        const { email, pwd } = req.body;

        // chk email, password
        if (!(email && pwd)) {
            res.status(400).send('all inputs are required');
        }

        // chk email already exists
        const old_user = await User.findOne({ email: email });
        if (old_user) {
            return res.status(409).send('409 Conflict : User already exists');
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
        }, process.env.JWT_KEY, { expiresIn: '1h' });
        u.token = token;
        await u.save();
        // https://expressjs.com/en/api.html#res.cookie
        res.cookie('jwt', token);

        // sending user successfully created response
        res.status(201).json(u);

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;