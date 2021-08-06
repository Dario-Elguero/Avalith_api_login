const express = require('express')
const routes = require('./routes')

server = express()

server.name="API"

server.use(express.json())
server.use(express.urlencoded({extended:false}))

server.use('/', routes);

server.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
  });
  
module.exports = server;