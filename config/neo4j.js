const neo4j = require('neo4j-driver').v1;

let driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'neo4j'));
let session = driver.session();

module.exports = {
    driver,
    session
};