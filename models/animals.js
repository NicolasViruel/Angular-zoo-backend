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
    image: {
        type: String,
        default: null
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' } //referenciamos con la coleccion de usuarios
});

module.exports = mongoose.model('Animal', AnimalSchema);