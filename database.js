const Sequelize = require('sequelize');
const config = require('./config/config.json');
const User = require('./models/user');
const Article = require('./models/article');
const Category = require('./models/category');
const Attribute = require('./models/attribute');
const Comment = require('./models/comment');
const Product = require('./models/product');
const ProductAttribute = require('./models/productAttribute');

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
    Attribute: Attribute(sequelize, Sequelize),
    Comment: Comment(sequelize, Sequelize),
    Product: Product(sequelize, Sequelize),
    ProductAttribute: ProductAttribute(sequelize, Sequelize),
};

models.Product.hasMany(models.Comment, {
    as: 'comment',
    foreignKey: 'productId',
});
models.Comment.belongsTo(models.Product);

models.Category.hasOne(models.Product, {
    as: 'category',
    foreignKey: 'categoryId',
});
models.Product.belongsTo(models.Category);

models.Product.belongsToMany(models.Attribute, {
    as: 'attribute',
    through: {
        model: models.ProductAttribute,
        unique: false,
    },
    foreignKey: {
        primaryKey: true,
        fieldName: 'productId'
    },
});

models.Attribute.belongsToMany(models.Product, {
    as: 'product',
    through: {
        model: models.ProductAttribute,
        unique: false,
    },
    foreignKey: {
        primaryKey: true,
        fieldName: 'attributeId',
    },
});

module.exports = {
    ...models,
    sequelize,
};
