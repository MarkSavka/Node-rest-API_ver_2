const http = require('http');
const port = process.env.port || 3100;
const app = require('./app');
const hbs = require('express-handlebars');

const server = http.createServer(app);

server.listen(port);