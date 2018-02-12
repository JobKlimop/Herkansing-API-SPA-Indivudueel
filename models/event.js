const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    eventImageUrl: {
        type: String,
        required: false
    },
    artist: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    noOfTickets: {
        type: Number,
        required: true
    },
    ticket: [{
        type: Schema.Types.ObjectId,
        ref:'ticket'
    }]
});

const Event = mongoose.model('event', EventSchema);

module.exports = Event;