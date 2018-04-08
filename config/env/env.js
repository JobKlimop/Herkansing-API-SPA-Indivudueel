const secretKey = 'UltraSecretTicketKey';

let env = {
    webPort: process.env.PORT || 3000,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'ticketking'
};

let dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase;

let username = 'Thomas';
let password = 'b.YZu8QyqLbYBw.KpNzNFE8Bo26F9yM';
let url = 'bolt://hobby-mbbmcodoeiibgbkejagmloal.dbs.graphenedb.com:24786';

module.exports = {
    env: env,
    dburl: dburl,
    username: username,
    password: password,
    url: url,
    secKey: secretKey
};