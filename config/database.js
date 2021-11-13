const mongoose = require('mongoose');
const { MONGO_URI } = process.env;

console.log(`{ MONGO_URI } : ${ MONGO_URI }`);


exports.connect = () => {

    // https://mongoosejs.com/docs/connections.html
    // https://mongoosejs.com/docs/connections.html#callback
    mongoose
        .connect(MONGO_URI)
        .then(
            () => {
                console.log(`mongodb ready to use...`);
            }
        )
        .catch((err) => {
            console.log(`mongodb connection failed...`);
            console.log(err);
        });

};