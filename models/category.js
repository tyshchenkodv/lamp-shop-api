module.exports = (sequelize, DataTypes) => {
    return sequelize.define('category', {
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
    })
};
