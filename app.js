const express = require('express');
const app = express();
const auth = require('./middlewares/auth');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(express.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

app.use(auth);

app.use(errorHandler);

module.exports = app;