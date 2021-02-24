const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    page: {
        type: Number,
    },
    pages: {
        type: Number,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
    },
}, {
        versionKey: false
    });


module.exports = mongoose.model('Task', TaskSchema);