const User = require('../models/user.model');
const Task = require('../models/task.model');

async function search(filters) {
    try {
        const task = {}
        if(!filters.page) {
            filters['page'] = 1;
        }

        task['total'] = await Task.count({user: filters.user});
        task['pages'] = task.total % 8 == 0 ? task.total / 8 : parseInt(task.total / 8) + 1;
        console.log(task.pages)
        task['items'] = await Task.find({user: filters.user})
            .limit(8)
            .skip(filters.page != 1 ? 8 * (filters.page - 1) : 0)
            .populate({ path: 'users', model: User, select: 'name lastName _id email' }
            )
        return task;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function create(filters) {
    try {
        let task = await Task(filters).save();
        await User.updateOne(
            { _id: filters.user },
            { $push: { tasks: task._id } }
        );
        return task;
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteTask(id, user) {
    try {
        const task = await Task.findOneAndDelete(
            { _id: id })
        await User.updateOne(
            { _id: user },
            { $pull: { tasks: id } }
        );
        return true

    } catch (error) {
        console.log(error)
        return error;
    }
}

async function update(task) {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            { _id: task.id },
            task
            ).then(returnedtask => {
            if (!returnedtask) {
                return { status: 404, error: 'This task doesn\'t exist.'};
            }
            if (returnedtask.user != task.modifiedBy) {
                return { status: 401, error: 'You can\'t delete this project.'};
                // return { error: 'Unauthorized', message: 'You can\'t delete this project.' };
            }
            return returnedtask
        })
        return updatedTask;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    create,
    search,
    deleteTask,
    update
};
