module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
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
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        text: {
            type: DataTypes.TEXT,
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
    })
};
