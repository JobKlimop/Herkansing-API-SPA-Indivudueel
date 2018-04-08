const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const Ticket = mongoose.model('ticket');

describe('Ticket controller', () => {

    beforeEach((done) => {
        let ticket = new Ticket ({
            user: 'Testuser',
            event: 'Testevent',
            ticketType: 'Normal',
            ticketPrice: 100
        });

        Promise.all([ticket.save()])
            .then(() => done());
    });

    it('GET all tickets', (done) => {
        Ticket.find({})
            .then(response => {
            console.log('TICKET ' + response.toString());
            assert(response[0].user === 'Testuser');
            done();
        });
    });


});