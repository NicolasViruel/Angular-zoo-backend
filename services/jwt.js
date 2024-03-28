const jwt = require("jwt-simple");
const moment = require("moment");

const createToken = function (findUser) {
    let payload = {
        sub: findUser._id,
        name: findUser.name,
        surname: findUser.surname,
        email: findUser.email,
        role: findUser.role,
        image: findUser.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix(),
    };

    return jwt.encode(payload, process.env.SECRET);



}

module.exports = {
    createToken,
}