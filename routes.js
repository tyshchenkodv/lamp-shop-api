const express = require('express');
const AuthController = require('./controllers/AuthController');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send({
        code: 200,
        message: 'ok',
    });
});

router.post('/login', AuthController.login);

module.exports = router;
