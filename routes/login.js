const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const salt = 10;
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const mymail = require('../services/mymail');


router.route('/')

.get((req, res) => {
    res.render('login');
})

.post(async function(req, res) {
    try {
        console.log('--------------login');
        console.log(req.body);
        const { email, pwd } = req.body;

        // chk email, password
        if (!(email && pwd)) {
            return res.status(400).render('login', { someMsg: 'Credentials missing!' });
        }

        // chk user already exists
        const u = await User.findOne({ email: email });
        if (!u) {
            return res.render('login', { someMsg: 'This email is not registered' });
            // return console.log('user with this email not registered...');
        }
        // console.log(u);
        // https://github.com/dcodeIO/bcrypt.js#usage---async
        // https://github.com/dcodeIO/bcrypt.js#compares-hash-callback-progresscallback
        const isCorrectPwd = await bcrypt.compare(pwd, u.password);
        if (!isCorrectPwd) {
            return res.render('login', { someMsg: 'Wrong password' });
        }
        if (u && isCorrectPwd) {
            const token = jwt.sign({
                _id: u._id
            }, process.env.JWT_KEY, { expiresIn: '50s' });
            u.token = token;
            await u.save();
            // https://expressjs.com/en/api.html#res.cookie
            res.cookie('jwt', token);
            // console.log(u);
            return res.redirect('/welcome');
            // return res.status(201).json(u);
        }
        res.status(401).send('invalid credentials');
    } catch (err) {
        console.log(err);
    }
});

router.route('/forgot-pwd')

.get(async(req, res) => {
    try {
        res.status(200).render('forgotpwd');
    } catch (err) {
        return res.json(err.message);
    }
})

.post(async(req, res) => {
    try {
        // chk if email is recieved in req.body
        console.log(req.body);
        const { email } = req.body;
        if (!email) {
            return res.status(200).render('forgotpwd', { someMsg: 'Email field is required' });
        }

        // chk if email registered into db
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).render('forgotpwd', { someMsg: 'email not registered, Try entering correct email' });
        }
        console.log(user);


        const secret = process.env.JWT_KEY + user.password;
        console.log(secret);
        const token = jwt.sign({
            email: user.email
        }, secret, { expiresIn: '2m' });
        console.log(token);

        const dt1 = new Date();
        const dt2 = new Date(Date.now() + 2 * 60 * 1000);
        console.log('jwt token created on : ', dt1.toLocaleString());
        console.log('jwt token will expire on : ', dt2.toLocaleString());

        const pwdResetLink = `${process.env.APP_BASE_URL}/login/reset-pwd/${user._id}/${token}`;
        console.log(pwdResetLink);


        mymail.sendEmail({
            subject: 'Reset password for the app',
            email: user.email,
            text: pwdResetLink
        });

        res.redirect('/login/reset-pwd');
        // res.status(200).render('forgotpwd');
    } catch (err) {
        return res.json({ error: err.message });
    }
});

router.route('/reset-pwd')

.get(async(req, res) => {
    try {
        res.status(200).render('http', { imgUrl: '/pix/200.jpeg', status: '200: OK, passwrod reset link sent on your email' })
    } catch (err) {
        return res.json({ error: err.message });
    }
})

.post(async(req, res) => {
    try {
        console.log(req.body);
        const { email, pwd } = req.body;

        // chk  password
        if (!(pwd)) {
            return res.status(400).render('reset-pwd', { email: email, someMsg: 'Password missing!' });
        }

        // chk if pwd length atleast 8
        console.log(pwd.length);
        if (pwd.length < 8) {
            return res.status(400).render('reset-pwd', { email: email, someMsg: 'Password must be of at least 8 characters!' });
        }

        // creating new user
        // https://github.com/dcodeIO/bcrypt.js#hashs-salt-callback-progresscallback
        const hash = await bcrypt.hash(pwd, salt);
        const u = await User.findOne({ email: email });
        u.password = hash;

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
        res.redirect('/welcome');
    } catch (err) {
        return res.json({ error: err.message });
    }
});

// https://stackoverflow.com/questions/41736413/multiple-optional-route-parameters-in-express/41748728
router.route('/reset-pwd/:_id/:token')

.get(async(req, res) => {
    try {
        // chk whether _id & token parameters are received
        console.log(req.params);
        const { _id, token } = req.params;
        if (!(_id && token)) {
            return res.status(404).render('http', { imgUrl: '/pix/404a.jpg', status: '404: Not Found, Invalid password reset link' });
        }

        // chk if user already exists 
        const user = await User.findOne({ _id: _id });
        if (!user) {
            return res.status(400).render('http', { imgUrl: '/pix/400.jfif', status: '400 Bad Reques, user not registered with this email' });
        }
        console.log(user);


        // get user _id from by verifyng jsonwebtoken 
        const secret = process.env.JWT_KEY + user.password;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            return res.status(404).render('http', { imgUrl: '/pix/404a.jpg', status: '404: Not Found, Password reset link has been expired' });
        }
        console.log(decoded);

        res.render('reset-pwd', { email: decoded.email });

        // const u = await User.findOne({ _id: decoded._id });
        // console.log(u);
        // if (u != user) {
        //     return res.status(400).render('http', { imgUrl: '/pix/400.jfif', status: '400: Bad Request, user not registered or JWTTOKEN is tampered with' });
        // }
    } catch (err) {
        return res.json({ error: err.message });
    }
});


module.exports = router;