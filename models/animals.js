const mongoose = require("mongoose");

const AnimalSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
        minLength: 8,
        require: true,
    },
    description: {
        type: String,
        maxLength: 50,
        minLength: 8,
        require: true,
    },
    year: {
        type: Number,
        maxLength: 10,
        minLength: 5,
        require: true,
    },
    Image: {
        type: String,
        require: true,
    },
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Animal', AnimalSchema);