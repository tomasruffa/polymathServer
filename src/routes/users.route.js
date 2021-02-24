const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const userCtrl = require('../controllers/users.controller');
const requireAuth = require('../middleware/require-auth');

router.use(requireAuth);
router.route('/check').get(asyncHandler(check));
router.route('/get').get(asyncHandler(get));

module.exports = router;

async function get(req, res) {
    if(!req.query.userId) {
        res.status(400);
        res.json({ error: "UserId query param is mandatory"})
    }
    const user = await userCtrl.getPatient(req.query.userId);
    res.json({ user });
}

async function check(req, res) {
    if(!req.query.email) {
        res.status(400);
        res.json({ error: "Email query param is mandatory"})
    }
    const userExists = await userCtrl.check(req.query.email, (req.query.documentId) ? req.query.documentId : null);
    res.send({ userExists });
}

