const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    email: {type: String, default: ''},
});

module.exports = mongoose.model('Users', userSchema)