const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = 10;
const jwt = require('jsonwebtoken');
const User = require('../model/user');



router.route('/')

.get((req, res) => {
    res.render('login');
})

.post(async function(req, res) {
    try {
        console.log(req.body);
        const { email, pwd } = req.body;

        // chk email, password
        if (!(email && pwd)) {
            res.status(400).send('all inputs are required');
        }

        // chk user already exists
        const u = await User.findOne({ email: email });
        // https://github.com/dcodeIO/bcrypt.js#usage---async
        // https://github.com/dcodeIO/bcrypt.js#compares-hash-callback-progresscallback
        const isCorrectPwd = await bcrypt.compare(pwd, u.password);
        console.log(u);
        console.log(isCorrectPwd);
        if (u && isCorrectPwd) {
            const token = jwt.sign({
                _id: u._id
            }, process.env.JWT_KEY, { expiresIn: '2h' });
            u.token = token;
            await u.save();
            res.status(201).json(u);
        }
        res.status(401).send('invalid credentials');

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;