const request = require('request');

const init = function RouteHandler(app) {
  app.get('/status', (req, res)=>{
    res.send({
      device: 'athena',
      status: 'OK'
    });
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
