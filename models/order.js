module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order', {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: true,
                notEmpty: true,
                len: [
                    2,
                    25,
                ],
            },
        },
        paymentType: {
            type: DataTypes.ENUM('Накладений платіж Нової пошти','Безготівковий розрахунок','Готівкою'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        status: {
            type: DataTypes.ENUM('Новый','Обработанный','Выполненный'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        deliveryAdress: {
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
        deliveryName: {
            type: DataTypes.ENUM('Самовивіз','Нова Пошта','Укрпошта','Meest Express'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    })
};
