const mongoose = require('mongoose');

const termsSchema = new mongoose.Schema({
    content: { type: String, required: [true, 'Content is must be Required'] },
},
    { timestamps: true },

);

module.exports = mongoose.model('Terms', termsSchema);