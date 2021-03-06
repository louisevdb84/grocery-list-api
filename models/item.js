const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,    
    ordered: Boolean,
    completed: Boolean,
    shopID: [String],
});

module.exports = mongoose.model('Item', itemSchema);