const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Shop', shopSchema);