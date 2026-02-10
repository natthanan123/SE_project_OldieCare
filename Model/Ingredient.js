const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    //ชื่อ
    name: {
        type: String,
        required: true,
        unique: true
    },
    //ชนิด
    category: {
        type: String,
        required: true,
        enum: ['Protein', 'Carbohydrate', 'Fat', 'Vegetable', 'Fruit']
    },
    //แคลอรี่ต่อกรัม
    caloriesPerGram: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'g'
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);