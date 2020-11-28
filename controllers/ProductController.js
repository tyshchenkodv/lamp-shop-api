const { Product } = require('./../database.js');

const NotFoundException = require('./../exceptions/NotFoundException');
const BadRequestException = require('./../exceptions/BadRequestException');
const UnauthorizedException = require('./../exceptions/UnauthorizedException');

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
    dss: async (req, res) => {
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

        console.log(soldedProducts);
        //let j = Object.keys(soldedProducts).length < 5 ?

        let vald = { value: 0 };

        for (let key in soldedProducts) {
            vald.id = key;
            vald.value = Math.min(soldedProducts[key][0], soldedProducts[key][1]);
        }

        let bayes = { value: -1 };

        for (let key in soldedProducts) {
            if(bayes.value < soldedProducts[key][0] * 0.3 + soldedProducts[key][1]*0.7) {
                bayes.id = key;
                bayes.value = soldedProducts[key][0] * 0.3 + soldedProducts[key][1]*0.7;
            }
        }

        let hurviz = { s: 0 };

        for (let key in soldedProducts) {
            const minA = Math.min(soldedProducts[key][0], soldedProducts[key][1]);
            const maxA = Math.max(soldedProducts[key][0], soldedProducts[key][1]);
            hurviz.id = key;
            hurviz.s = 0.3 * minA + 0.7 * maxA;
        }

        const criteries = [vald, bayes, hurviz];

        let valdCounter = 0;
        let bayesCounter = 0;
        let hurvizCounter = 0;

        if(vald.id === bayes.id){
            valdCounter++;
        }
        if(vald.id === hurviz.id){
            valdCounter++;
        }

        if(bayes.id === vald.id){
            bayesCounter++;
        }
        if(bayes.id === hurviz.id){
            bayesCounter++;
        }

        if(hurviz.id === vald.id){
            hurvizCounter++;
        }
        if(hurviz.id === bayes.id){
            hurvizCounter++;
        }

        const arr = [valdCounter, bayesCounter, hurvizCounter];
        console.log(criteries[arr.indexOf(Math.max.apply(this, arr))]);

        return res.status(201).send({
            item: products,
        });
    },
};
