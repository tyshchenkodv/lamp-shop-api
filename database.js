const Sequelize = require('sequelize');
const config = require('./config/config.json');
const User = require('./models/user');
const Article = require('./models/article');
const Category = require('./models/category');
const Comment = require('./models/comment');
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
const ProductOrder = require('./models/productOrder');
const Region = require('./models/region');

const sequelize = new Sequelize(
    config.connection.database,
    config.connection.username,
    config.connection.password,
    {
        host: config.connection.options.host,
        dialect: config.connection.options.dialect,
        logging: config.connection.options.logging,
        define: {
            timestamps: false
        }
    }
);

const models = {
    User: User(sequelize, Sequelize),
    Article: Article(sequelize, Sequelize),
    Category: Category(sequelize, Sequelize),
    Comment: Comment(sequelize, Sequelize),
    Product: Product(sequelize, Sequelize),
    Customer: Customer(sequelize, Sequelize),
    Order: Order(sequelize, Sequelize),
    ProductOrder: ProductOrder(sequelize, Sequelize),
    Region: Region(sequelize, Sequelize),
};

models.Product.hasMany(models.Comment, {
    as: 'comments',
    foreignKey: 'productId',
});
models.Comment.belongsTo(models.Product);

models.Category.hasOne(models.Product, {
    as: 'category',
    foreignKey: 'categoryId',
});
models.Product.belongsTo(models.Category);

models.Category.hasMany(models.Category, {
    as: 'child',
    foreignKey: 'parentId'
});

models.Customer.hasMany(models.Order, {
    as: 'customer',
    foreignKey: 'customerId',
});
models.Order.belongsTo(models.Customer);

models.Region.hasOne(models.Customer, {
    as: 'region',
    foreignKey: 'regionId',
});
models.Customer.belongsTo(models.Region);

models.Product.belongsToMany(models.Order, {
    as: 'order',
    through: {
        model: models.ProductOrder,
        unique: false,
    },
    foreignKey: {
        primaryKey: true,
        fieldName: 'productId'
    },
});
models.Order.belongsToMany(models.Product, {
    as: 'product',
    through: {
        model: models.ProductOrder,
        unique: false,
    },
    foreignKey: {
        primaryKey: true,
        fieldName: 'orderId',
    },
});

module.exports = {
    ...models,
    sequelize,
};
