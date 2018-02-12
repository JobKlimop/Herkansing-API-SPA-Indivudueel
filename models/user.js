const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TicketSchema = require('./ticket');

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tickets: [{
        type: Schema.Types.ObjectId,
        ref: 'ticket'
    }]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;