const express = require('express');
const router = express.Router();

const AuthController = require('./controllers/AuthController');
const ArticleController = require('./controllers/ArticleController');

const auth = require('./middlewares/auth');

router.get('/', (req, res) => {
    return res.send({
        code: 200,
        message: 'ok',
    });
});

router.post('/login', AuthController.login);

router.get('/articles', ArticleController.list);
router.post('/articles', auth, ArticleController.create);
router.get('/articles/:id', ArticleController.item);
router.put('/articles/:id', auth, ArticleController.update);
router.delete('/articles/:id', auth, ArticleController.delete);

module.exports = router;
