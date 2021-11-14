require('dotenv').config();
require(`./config/database`).connect();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const app = express();


app.use(express.json());
app.use(morgan('dev'));
// to serve static content
app.use(express.static(path.join(__dirname, 'public')));
// setting html template
app.set('view engine', 'ejs');
// to properly get POST method req.body
app.use(express.urlencoded({
    extended: true
}));

app.use('/register', registerRoute);
app.use('/login', loginRoute);

app.route('/')

.get((req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            message: '/'
        }
    });
});




module.exports = app;
// app.listen(process.env.PORT || 3000, function() {
//     console.log(`app is listening on port 3000!!!`);
// });