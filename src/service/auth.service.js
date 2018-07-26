const jwt = require('jsonwebtoken');
const SECRET = require('../../enviroment.const').SECRET;


decodeUser = (token) => {
    if (token)
        return jwt.decode(token);
    else
        console.error('token is undefined')
};

module.exports.decodeUser = decodeUser;