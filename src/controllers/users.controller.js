const bcrypt = require('bcrypt');
const User = require('../models/user.model');

async function check(userEmail) {
    try {
        let filter = {email: userEmail};
        const user = await User.findOne(filter);
        if(user) {
            return true;
        } else {
            return false;
        }
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function create(user) {
    try {
        if(!user.password)
            user['password'] = 'pass1234';

        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;
        const createdUser = await User(user).save();
        return createdUser;
    } catch(error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    check,
    create,
};
