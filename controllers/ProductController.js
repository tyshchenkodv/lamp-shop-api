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

        const item = await Product.findOne({
            where: {
                id
            },
        });

        return res.status(201).send({
            item: item.dataValues,
        });
    },
};
