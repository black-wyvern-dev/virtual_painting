const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {type: String, default: ''},
    id: {type: String, default: ''},
    type: {type: String, default: ''},
    src: {type: String, default: ''},
});

module.exports = mongoose.model('ProductInfos', productSchema)