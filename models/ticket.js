const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EventSchema = require('./event');

const TicketSchema = new Schema({
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