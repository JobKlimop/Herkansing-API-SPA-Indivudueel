const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = mongoose.model('user');
const Event = mongoose.model('event');

describe('Event controller', () => {

    beforeEache((done) => {
        const event = new Event({
            eventName: 'Testevent',
            artist: 'Testevent',
            eventDate: '2018-04-08',
            eventTime: '00:00',
            location: 'Testlocation',
            noOfTickets: 1000,
            ticketTypes: [{
                ticketType: 'normal',
                price: 100
            }]
        });

        Promise.all([event.save()])
            .then(() => done());
    });

    it('GET all events', (done) => {
        Event.find({})
            .then(response => {
                console.log('Events ' + response.toString());
                assert(response[0].eventName === 'Testevent');
                done();
            });
    });
});