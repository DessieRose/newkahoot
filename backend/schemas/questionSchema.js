const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true, },
    RA_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }
});

module.exports = mongoose.model('Question', questionSchema);