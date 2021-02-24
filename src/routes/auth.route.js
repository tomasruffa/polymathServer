const express = require('express');
const asyncHandler = require('express-async-handler')
const passport = require('passport');
const authCtrl = require('../controllers/auth.controller');
const userCtrl = require('../controllers/users.controller');

const router = express.Router();

router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, function(err, user, info){
        asyncHandler(login(err, user, info, res, next));
    })(req, res, next);
});

router.post('/register', asyncHandler(register), function(req, res) {
    asyncHandler(login(null, req.user, null, res));
    console.log("Succes")
});

router.get('/me', function (req, res, next) {
    authCtrl.verifyToken(req, res, login);
});

async function register(req, res, next) {
    const userExists = await userCtrl.check(req.body.user.email)
    if(userExists) {
        res.json({ userExists: true });

    } else {
        let user = await userCtrl.create(req.body.user);
        user = user.toObject();
        delete user.hashedPassword;
        req.user = user;
        next();
    }
}

async function login(err, user, info, res, next) {
    if (err) {
        console.log(err);
        return next(err);
    }
    if (!user) {
        console.log(info)
        return res.json(info)
    }
    const token = await authCtrl.login(user._id, user.email);
    res.setHeader('token', token);
    res.json({user})
}

module.exports = router;