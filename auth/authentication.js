const moment = require('moment');
const jwt = require('jwt-simple');
const env = require('../config/env/env');

function encodeToken(username) {
    const payload = {
        exp: moment().add(15, 'minutes').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(payload, env.secKey);
}

function decodeToken(token) {
    try {
        const payload = jwt.decode(token, env.secKey);

        const currentTime = moment().unix();

        if(currentTime > payload.exp) {
            console.log('Token expired');
            return false;
        }

        return true;
    }
    catch(err) {
        return false;
    }
}

function getCurrentUser(token) {
    try {
        const payload = jwt.decode(token, env.secKey);

        const currentUser = payload.sub;

        return currentUser;
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    encodeToken,
    decodeToken,
    getCurrentUser
};