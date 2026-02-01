const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
    q_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    answerText: { type: String, required: true },
    order_id: { type: Number },
});

module.exports = mongoose.model('Answer', AnswerSchema);