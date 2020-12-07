const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: String,
    _id: Schema.ObjectId
});

module.exports = mongoose.model('Shop', shopSchema);