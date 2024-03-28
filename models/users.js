const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
        minLength: 4,
        require: true,
    },
    surname: {
        type: String,
        maxLength: 50,
        minLength: 4,
        require: true,
    },
    email: {
        type: String,
        maxLength: 50,
        minLength: 4,
        require: true,
        unique: true
    },
    password: {
        type: String,
        maxLength: 100,
        minLength: 8,
        require: true,
    },
    image: {
        type: String,
        require: true
    },
    role: {
        type: String,
        maxLength: 50,
        minLength: 4,
        require: true,
    }
})

module.exports = mongoose.model("User", UserSchema);