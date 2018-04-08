const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    user: [{
        type: String,
        required: true
    }],
    event: [{
        type: String,
        required: true
    }],
    ticketType: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    }
});

const Ticket = mongoose.model('ticket', TicketSchema);

module.exports = Ticket;