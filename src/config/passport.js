const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const localLogin = new LocalStrategy({
    usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
}, async (email, password, done) => {
    let user = await User.findOne({ email });
    if (!user) {
        return done(null, null, { errorMessage: "Usuario o email inexistente", errorType: 'invalid-user' });
    }

    if (!bcrypt.compareSync(password, user.hashedPassword)) {
        return done(null, null, { errorMessage: "Contraseña incorrecta", errorType: 'invalid-password' });
    }

    user = user.toObject();
    delete user.hashedPassword;
    done(null, user);
});

passport.use(localLogin);

module.exports = passport;
