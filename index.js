// config should be imported before importing any other file
const config = require('./src/config/config');
const app = require('./src/config/express');
require('./src/config/mongoose');

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
    app.listen(config.port, () => {
        console.info(`Server ---Polymath Server--- started on port ${config.port} (${config.env})`);
    });
}

module.exports = app;
