const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: false
    },
    receiver: {
        type: String,
        required: false
    }
}, { timestamps: true }); // https://masteringjs.io/tutorials/mongoose/timestamps

// https://mongoosejs.com/docs/models.html#compiling
const User = mongoose.model("File", fileSchema);
module.exports = User;