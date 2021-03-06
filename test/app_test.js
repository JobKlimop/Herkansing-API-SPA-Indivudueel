const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('Express app', () => {
    it('handles a GET request to /api', (done) => {
        request(app)
            .get('/api')
            .end((err, response) => {
                console.log(response.body);
                assert(response.body.test === 'Test succeeded');
                done();
            });
    });
});