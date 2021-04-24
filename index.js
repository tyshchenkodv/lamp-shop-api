const app = require('./app');
const config = require('./config/config.json');

const listen = app.listen(config.port, () => {
    console.log(`App server is running on port ${config.port}`);
});
