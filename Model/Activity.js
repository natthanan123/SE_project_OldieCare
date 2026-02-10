const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    caloriesPerMinute: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: 'Exercise'
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema);