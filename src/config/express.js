const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport');

const app = express();

if (config.env === 'development') {
    app.use(logger('dev'));
}

app.use(bodyParser.json({limit: '16mb'}));
app.use(bodyParser.urlencoded({limit: '16mb', extended: true, parameterLimit: 16000 }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());


// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(passport.initialize());

app.use((req, res, next) => {
    res.header('access-control-expose-headers', 'token');
    next();
});


// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new httpError(404)
    return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

    // customize Joi validation errors
    if (err.isJoi) {
        err.message = err.details.map(e => e.message).join("; ");
        err.status = 400;
    }

    res.status(err.status || 500).json({
        message: err.message
    });
    next(err);
});

module.exports = app;
