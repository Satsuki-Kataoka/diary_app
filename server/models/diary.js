const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    emotion: {
        type: String,
        required: true,
    },
    aiComment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Diary', diarySchema);