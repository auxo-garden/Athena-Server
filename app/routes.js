const Plant = require('../app/models/plant');
const request = require('request');

const init = function RouteHandler(app, io) {
    app.get('/status', (req, res) => {
        res.send({
            device: 'athena',
            status: 'OK'
        });
        console.log('req.ip: ' + req.ip);
        console.log('req.hostname: ' + req.hostname);
        request.get({
            url: req.ip + ':8080/status'
        }, (error, response, body) => {
            console.log("Response from %s: %s", req.ip, body);
        });
    });

    /* This was for plant recommendation demo. TODO: remove */
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    app.get('/dashboard', (req, res) => {
        res.render('dashboard.ejs', { data: null });
    });

    app.post('/dashboard', (req, res) => {
        // Get weather from input city
        var url = 'http://api.openweathermap.org/data/2.5/weather';

        var param = {
            zip: req.body.zipcode,
            units: 'imperial',
            appid: '1e2b29a39b4e27376104e02338d27dbf'
        };

        request({ url: url, qs: param }, (err, response, body) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log("Got response: " + response.statusCode);

            var body = JSON.parse(response.body);

            // If zipcode was valid then retrieve a list of all growable plants based on the city's current temperature.
            if (body.main) {
                var temp = body.main.temp;

                var plants = Plant.findAll({
                    include: [{ all: true }],
                    where: {
                        minTemp: { $lt: temp }, // Plant's min-temp <= city temp
                        maxTemp: { $gt: temp } // Plant's max-temp >= city temp
                    },
                    raw: true
                });

                plants.then(function () {
                    res.render('dashboard.ejs', { data: plants._rejectionHandler0 });
                });
            }
            else {
                res.render('dashboard.ejs', { data: null });
            }
        });
    });

    // Datatransfer test route
    app.post('/test', (req, res) => {
        console.log("data: " + req.body);
        res.send('success');
    });

    io.on('connection', (socket) => {
        socket.emit('test', { message: 'success', id: socket.id });

        socket.on('waterReading', console.log);
    });
}

module.exports = init;