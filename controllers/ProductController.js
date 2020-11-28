const { Product } = require('./../database.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const NotFoundException = require('./../exceptions/NotFoundException');
const BadRequestException = require('./../exceptions/BadRequestException');
const UnauthorizedException = require('./../exceptions/UnauthorizedException');

const DSS = require('../dss');

module.exports = {
    list: async (req, res) => {
        const data = await Product.findAll({
            include: [
                'comments',
                'category',
            ],
        });

        return res.status(200).send({
            data,
        });
    },
    item: async (req, res, next) => {
        const { id } = req.params;

        const item = await Product.findByPk(id, {
            include: [
                'comments',
                'category',
            ],
        });

        if (!item) {
            return next(new NotFoundException());
        }

        return res.status(200).send({
            item,
        });
    },
    update: async (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedException());
        }

        const { id } = req.params;

        const item = await Product.findByPk(id);

        if (!item) {
            return next(new NotFoundException());
        }

        const data = req.body;
        data.image = req.file ? `${req.file.destination}/${req.file.filename}` : null;

        try {

            await item.update(data);

        }catch (error) {

            return next(new BadRequestException(error));

        }

        return res.status(204).send();
    },
    delete: async (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedException());
        }

        const { id } = req.params;
        const item = await Product.findByPk(id);

        if (!item) {
            return next(new NotFoundException());
        }

        await item.destroy();

        return res.status(204).send();
    },
    create: async (req, res, next) => {
        if (!req.user) {
            return next(new UnauthorizedException());
        }

        try {

            const data = req.body;
            data.image = req.file ? `${req.file.destination}/${req.file.filename}` : null;

            await Product.create(data);

        } catch (error) {

            return next(new BadRequestException(error));

        }

        return res.status(201).send();
    },
    dss: async (req, res, next) => {
        const { id } = req.params;

        const products = await Product.findAll({
            where: {
                categoryId: id,
            },
        });

        const soldedProducts = {};

        products.map(product => soldedProducts[`${product.dataValues.id}`] = [
            product.dataValues.count,
            product.dataValues.solded,
        ]);


        let productIdsToPurchase;
        try {
            productIdsToPurchase = DSS(soldedProducts);
        } catch (err){
            next(BadRequestException(err));
        }

        const purchasesList = await Product.findAll({
            where: {
                [Op.or]: [
                    { id: productIdsToPurchase },
                ],
            },
        });

        let purchases = [];

        productIdsToPurchase.map(item => {
            purchasesList.map(({ dataValues }) => {
                if (item === dataValues.id.toString()){
                    purchases.push(dataValues);
                }
            })
        });

        return res.status(201).send({
            item: purchases,
        });
    },
};
