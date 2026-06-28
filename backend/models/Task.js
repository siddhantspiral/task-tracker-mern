const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is mandatory'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);