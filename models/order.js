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
            type: DataTypes.ENUM('Банковский перевод (Безналичный расчет)','Оплата при доставке'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
        deliveryType: {
            type: DataTypes.ENUM('Самовывоз из магазина','Доставка любым удобным перевозчиком'),
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
            type: DataTypes.ENUM('Новый','Обработанный','Выполненный','Возврат'),
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true,
            },
        },
    })
};
