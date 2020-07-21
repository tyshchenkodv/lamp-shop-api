const express = require('express');
const app = express();
const auth = require('./middlewares/auth');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');
const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
const cors = require('cors');

app.use(express.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(upload.any());

app.use(cors());
app.use('/', router);

app.use(auth);

app.use(errorHandler);

module.exports = app;