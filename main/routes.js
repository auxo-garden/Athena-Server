const request = require('request');

const init = function RouteHandler(app) {
  app.get('/status', (req, res)=>{
    res.send("Ayyyy Lmao\n");
    console.log('req.ip: ' + req.ip);
    console.log('req.hostname: ' + req.hostname);
    request.get({
      url: req.ip+':8080/status'
    }, (error, response, body)=>{
      console.log("Response from %s: %s", req.ip, body);
    });
  });
}

module.exports = init;
