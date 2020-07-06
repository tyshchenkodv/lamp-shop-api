const app = require('./app');
const config = require('./config/config.json.example');

const listen = app.listen(config.port, () => {
    console.log('App server is running!');
});