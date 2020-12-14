const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suggestedItemSchema = new Schema({
    name: String,    
    isWeekly: Boolean,
    shopID: [String],
});

module.exports = mongoose.model('SuggestedItem', suggestedItemSchema);