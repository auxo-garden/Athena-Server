const http = require('http');
const port = process.env.PORT || 8080;
const express = require('express');
const routes = require('./app/routes.js');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const server = require('http').Server(app);
const io = require('socket.io')(server);

routes(app, io);

server.listen(port);

console.log("Server is running");