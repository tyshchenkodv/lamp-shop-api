module.exports = (sequelize, DataTypes) => {
    return sequelize.define('article', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    5,
                    300,
                ],
            },
        },
        metaDescription: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    5,
                    255,
                ],
            },
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    5,
                    50,
                ],
            },
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    1,
                    65,
                ],
            },
        },
    })
};
