const { Product } = require('./../database.js');
const { sequelize } = require('./../database.js');
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

        const soldedProducts = {};

        sequelize.query(`select p.id, p.name, p.code, p.price, p.count, count(*) as solded from products p join productorders po on po.productId = p.id join orders o on o.id = po.orderId where p.categoryId = ${id} group by p.code order by p.code\n`, { type: sequelize.QueryTypes.SELECT})
            .then(async function(products) {

                products.map(product => soldedProducts[`${product.id}`] = [
                    product.count,
                    product.solded,
                ]);
                let productIdsToPurchase;
                try {
                    productIdsToPurchase = DSS(soldedProducts);
                } catch (err){
                    next(BadRequestException(err));
                }

                let purchases = [];

                productIdsToPurchase.map(item => {
                    products.map((prod) => {
                        if (item === prod.id.toString()){
                            purchases.push(prod);
                        }
                    })
                });

                return res.status(201).send({
                    item: purchases,
                });
            });
    },
};
