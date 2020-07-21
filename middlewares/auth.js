const jwt = require('jsonwebtoken');
const {User} = require('./../database.js');
const config = require('../config/config.json');
const auth = config.auth;
const UnauthorizedException = require('./../exceptions/UnauthorizedException');

module.exports = async (req, res, next) => {
    try {

        const payload = jwt.verify(req.header('access_token'), auth.secret);

        if(payload){
            const user = await User.findByPk(payload.id);

            if(user){
                req.user = user;
            }
        }

        next();
    } catch (error){
        return next(new UnauthorizedException(error));
    }
};
