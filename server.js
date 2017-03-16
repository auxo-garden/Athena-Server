const express = require('express');
const routes = require('./main/routes.js');

var app = express();
routes(app);

app.listen(process.env.PORT || 8080);
console.log("Server is running");
