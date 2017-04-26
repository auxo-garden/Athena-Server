const http = require('http');
const port = process.env.PORT || 8080;
const express = require('express');
const routes = require('./app/routes.js');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const server = require('http').Server(app);
const io = require('socket.io')(server);

routes(app, io);

server.listen(port);

console.log("Server is running");