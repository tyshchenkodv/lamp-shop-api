module.exports = (sequelize, DataTypes) => {
    return sequelize.define('article', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    1,
                    300,
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
    })
};
