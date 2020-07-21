const { Article } = require('./../database.js');

const slugify = require('slugify');

const NotFoundException = require('./../exceptions/NotFoundException');
const BadRequestException = require('./../exceptions/BadRequestException');
const UnauthorizedException = require('./../exceptions/UnauthorizedException');

module.exports = {
    list: async (req, res) => {
        const data = await Article.findAll();

        return res.status(200).send({
            data,
        });
    },
    item: async (req, res, next) => {
        const { id } = req.params;

        const item = await Article.findByPk(id);

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
        req.body.alias = slugify(req.body.title, {
            replacement: '_',
            lower: true,
            locale: 'eu',
        });
        const data = req.body;

        const item = await Article.findByPk(id);

        if (!item) {
            return next(new NotFoundException());
        }

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
        const item = await Article.findByPk(id);

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
            data.alias = slugify(data.title, {
                replacement: '_',
                lower: true,
                locale: 'eu',
            });

            await Article.create(data);
        } catch (error) {

            return next(new BadRequestException(error));

        }

        return res.status(201).send();
    },
};
