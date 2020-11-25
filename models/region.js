module.exports = (sequelize, DataTypes) => {
    return sequelize.define('region', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    },);
};
