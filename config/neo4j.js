const neo4j = require('neo4j-driver').v1;
const config = require('./env/env');

// let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'neo4j'));
let driver = neo4j.driver(config.url, neo4j.auth.basic(config.username, config.password));
let session = driver.session();

module.exports = {
    driver,
    session
};