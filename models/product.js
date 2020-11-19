module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    2,
                    255,
                ],
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    3,
                    50,
                ],
            },
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        availability: {
            type: DataTypes.ENUM('В наявності', 'Немає в наявності'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    })
};
