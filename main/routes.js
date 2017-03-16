const request = require('request');

const init = function RouteHandler(app) {
  app.get('/status', (req, res)=>{
    res.send("Ayyyy Lmao\n");
    console.log('req.ip: ' + req.ip);
    console.log('req.hostname: ' + req.hostname);
  });
}

module.exports = init;
