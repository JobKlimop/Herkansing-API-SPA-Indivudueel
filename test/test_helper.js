process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const env = require('../config/env/env');
const app = require('../app');

before(done => {
    mongoose.connect(env.dbDatabase);
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning: ', err);
        });
});

beforeEach(done => {
    const {users} = mongoose.connection.collections;
    const {events} = mongoose.connection.collection;
    const {tickets} = mongoose.connection.collection;
    Promise.all([users.drop(), events.drop(), tickets.drop()])
        .then(() => done())
        .catch(() => done());
});