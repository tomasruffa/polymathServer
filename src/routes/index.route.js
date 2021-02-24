const express = require('express');
const userRoutes = require('./users.route');
const authRoutes = require('./auth.route');
const taskRoutes = require('./task.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('Polymath server pink OK')
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/task', taskRoutes);


module.exports = router;
