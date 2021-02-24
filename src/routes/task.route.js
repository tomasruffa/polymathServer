const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const requireAuth = require('../middleware/require-auth');
const taskController = require('../controllers/task.controller');

router.use(requireAuth);
router.route('/search').post(asyncHandler(search));
router.route('/create').post(asyncHandler(create));
router.route('/update').put(asyncHandler(update));
router.route('/delete').post(asyncHandler(taskDelete));
router.route('/get').post(asyncHandler(getTask));

module.exports = router;

async function search(req, res) {
    let filters = {};
    filters.user = req.body.user.id;
    filters.page = req.body.user.page;
    const tasks = await taskController.search(filters);
    res.json({ tasks });
}

async function create(req, res, next) {
    try {
        let filters = req.body.task;
        filters['user'] = res.locals.processedToken.id;
        let task = await taskController.create({ ...filters, createdBy: res.locals.processedToken.id });
        res.json({ task })
    } catch (error) {
        res.status(500);
        res.json({ error: "Internal error" })
        return error
    }

}

async function update(req, res) {
    try {
        req.body.task['modifiedBy'] = res.locals.processedToken.id;
        req.body.task['modifiedAt'] = new Date();
        const task = await taskController.update(req.body.task);
        if(task.status == 401 || task.status == 404) {
            res.status(task.status);
            res.json({ error: task.error })    
        } else {
            res.json({ task });
        }
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({ error: "Internal error" })
        return error;
    }
}

async function taskDelete(req, res) {
    try {
        const taskDelete = await taskController.deleteTask(req.body.id, res.locals.processedToken.id);
        res.json({ deleteSuccess: !!taskDelete })

    } catch (error) {
        res.status(500);
        res.json({ error: "Internal error" })
        return error;
    }
}

async function getTask(req, res) {
    console.log(req.body.description)
    try {
        const task = await taskController.getTask(req.body.description);
        res.json({ task })

    } catch (error) {
        res.status(500);
        res.json({ error: "Internal error" })
        return error;
    }
}
