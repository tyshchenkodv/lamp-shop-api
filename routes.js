const express = require('express');
const router = express.Router();
const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage,
});

const AuthController = require('./controllers/AuthController');
const ArticleController = require('./controllers/ArticleController');
const CategoryController = require('./controllers/CategoryController');
const AttributeController = require('./controllers/AttributeController');
const ProductController = require('./controllers/ProductController');
const OrderController = require('./controllers/OrderController');
const CustomerController = require('./controllers/CustomerController');

const auth = require('./middlewares/auth');

router.get('/', (req, res) => {
    return res.send({
        code: 200,
        message: 'ok',
    });
});

router.post('/login', AuthController.login);

router.get('/articles', ArticleController.list);
router.post('/articles', upload.single('image'), auth, ArticleController.create);
router.get('/articles/:id', ArticleController.item);
router.put('/articles/:id', upload.single('image'), auth, ArticleController.update);
router.delete('/articles/:id', auth, ArticleController.delete);

router.get('/categories', CategoryController.list);
router.post('/categories', auth, CategoryController.create);
router.get('/categories/:id', CategoryController.item);
router.put('/categories/:id', auth, CategoryController.update);
router.delete('/categories/:id', auth, CategoryController.delete);

router.get('/attributes', AttributeController.list);
router.post('/attributes', auth, AttributeController.create);
router.get('/attributes/:id', AttributeController.item);
router.put('/attributes/:id', auth, AttributeController.update);
router.delete('/attributes/:id', auth, AttributeController.delete);

router.get('/products', ProductController.list);
router.post('/products', auth, ProductController.create);
router.get('/products/:id', ProductController.item);
router.put('/products/:id', auth, ProductController.update);
router.delete('/products/:id', auth, ProductController.delete);

router.get('/customers', CustomerController.list);
router.post('/customers', auth, CustomerController.create);
router.get('/customers/:id', CustomerController.item);
router.put('/customers/:id', auth, CustomerController.update);
router.delete('/customers/:id', auth, CustomerController.delete);

router.get('/orders', OrderController.list);
router.post('/orders', auth, OrderController.create);
router.get('/orders/:id', OrderController.item);
router.put('/orders/:id', auth, OrderController.update);
router.delete('/orders/:id', auth, OrderController.delete);

module.exports = router;
