const Sequelize = require('sequelize');
const config = require('./config/config.json');
const User = require('./models/user');

const sequelize = new Sequelize(
    config.connection.database,
    config.connection.username,
    config.connection.password,
    {
        host: config.connection.options.host,
        dialect: config.connection.options.dialect,
        logging: config.connection.options.logging,
        define: {
            timestamps: false
        }
    }
);

const models = {
    User: User(sequelize, Sequelize),
};

module.exports = {
    ...models,
    sequelize,
};
