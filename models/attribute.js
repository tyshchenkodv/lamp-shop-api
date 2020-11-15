module.exports = (sequelize, DataTypes) => {
    return sequelize.define('attribute', {
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
        value: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    })
};
