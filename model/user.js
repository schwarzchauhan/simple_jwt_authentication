const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Provide email']
    },
    password: {
        type: String,
        required: [true, 'password not provided'],
        // https://mongoosejs.com/docs/api.html#schemastringoptions_SchemaStringOptions-minLength
        minLength: [8, 'password length must be at least 8 characters']
    },
    token: {
        type: String
    }
});

// https://mongoosejs.com/docs/models.html#compiling
const User = mongoose.model("User", userSchema);
module.exports = User;