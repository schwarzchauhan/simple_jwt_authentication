const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'eamil not provided']
    },
    password: {
        type: String,
        required: [true, 'password not provided'],
        minlength: [8, 'password length must be at least 8 characters']
    },
    token: {
        type: String
    }
});

// https://mongoosejs.com/docs/models.html#compiling
const User = mongoose.model("User", userSchema);
module.exports = User;