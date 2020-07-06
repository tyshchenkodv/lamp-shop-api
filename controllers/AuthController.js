const jwt = require('jsonwebtoken');
const {User} = require('./../database.js');
const config = require('../config/config.json');
const auth = config.auth;
const BadRequestException = require('./../exceptions/BadRequestException');
const InternalErrorException = require('./../exceptions/InternalErrorException');

module.exports = {
    async login (req, res, next) {
        const { email, password } = req.body;

        try {
            const errors = {};

            if (!email) {
                errors.login = {
                    message: 'Oops! Login invalid',
                };
            }
            if (!password) {
                errors.password = {
                    message: 'Oops! Password invalid',
                };
            }
            if (Object.keys(errors).length) {
                return next(new BadRequestException(errors));
            }

            const user = await User.unscoped().findOne({
                where: {
                    email,
                },
            });

            if (!user) {
                return next(new BadRequestException({
                    email: {
                        message: 'Oops! User not found',
                    },
                }));
            }

            const match = password === user.password;

            if (match) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                    },
                    auth.secret,
                    {
                        expiresIn: auth.expiresIn,
                    },
                );

                return res.status(200).send({
                    token,
                });
            }

            return next(new BadRequestException());
        } catch (error) {
            return next(new InternalErrorException());
        }
    }
};
