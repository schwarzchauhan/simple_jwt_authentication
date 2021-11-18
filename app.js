require('dotenv').config();
require(`./config/database`).connect();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const auth = require("./middleware/auth");
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const fileRoute = require('./routes/file');
const app = express();


app.use(express.json());
app.use(cookieParser());


morgan.token('id', function getId(req) {
    return req.id
})

// app.use(morgan('dev')); // https://github.com/expressjs/morgan#dev
app.use(assignId);
app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms'));

function assignId(req, res, next) {
    req.id = '----------'
    next();
}

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
app.use('/api/file', fileRoute);
app.use('/files', require('./routes/show'));

app.route('/')

.get((req, res) => {
    res.render('index');
});


app.get("/welcome", auth, (req, res) => {
    console.log('-------------welcome');
    // console.log('Cookies: ');
    // console.log(req.cookies);
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.headers);
    console.log(req.user);
    // console.log(req);
    res.status(200).json({
        status: 'success...',
        data: {
            message: 'here show the protected data of the user...'
        }
    });
});




module.exports = app;
// app.listen(process.env.PORT || 3000, function() {
//     console.log(`app is listening on port 3000!!!`);
// });