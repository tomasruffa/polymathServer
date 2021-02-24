const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user.model');

function login(userId, email) {
    var token = jwt.sign({
        id: userId,
        email: email
    }, process.env.JWT_SECRET, {
        expiresIn: 1800 // expires in 24 hours
    });
    console.log(token)
    return token;
}

async function verifyToken(req, res, next) {
    if(req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        let tokenData = processToken(token);
        if(tokenData.isExpired) {
            res.status(401);
            res.json({ error: 'Token Expired'});
        } else {
            try {
                let newToken = null;
                let user = await (await User.findOne({ email: tokenData.email } , '-hashedPassword'))
                user = user.toObject();
                req.user = user;
                res.locals.processedToken = tokenData;
                if(req.originalUrl.indexOf('auth/me') !== -1) {
                    next(null, user, null, res);
                } else {
                    res.setHeader('token', token);
                    next()
                }
            } catch (error) {
                console.log(error)
                res.status(500);
                res.json({ error: error});
            }
        }
    } else {
        res.status(401);
    }
}

function processToken(token) {
    const payload = jwt.decode(token);
    const expirationDate = moment(payload.exp * 1000);
    return {
        isExpired: expirationDate.isBefore(moment()),
        needRefresh: expirationDate.diff(moment(), 'minutes') < 2,
        email: payload.email,
        id: payload.id
    }
}

module.exports = {
    verifyToken,
    login
}