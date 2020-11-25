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
            },
        },
        type: {
            type: DataTypes.ENUM('Новость','Статья'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    })
};
