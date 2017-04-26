const Plant = require('../app/models/plant');
const User = require('../app/models/user');
const Garden = require('../app/models/garden');
const request = require('request');
var db = require('../config/database');

var moistureReading = -1; // The current moisture reading from the sensor, updated from the waterReading socket event.

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
        console.log(moistureReading);

        res.render('dashboard.ejs', { data: null });
    });

    // Return a list of plants that can be grown in a city
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
                    res.send({ data: plants._rejectionHandler0 });
                });
            }
            else {
                res.send({ data: null });
            }
        });
    });

    // Return current weather conditions of input city
    app.post('/weather', (req, res) => {
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

            // If zipcode was valid then return the current weather status of the input city.
            if (body.weather) { // Valid weather data
                console.log();
                res.send({ weather: body.weather[0].main });
            }
            else {
                res.send({ weather: null }); // No available weather data
            }

        });
    });

    // Return the current moisture reading of the sensor
    app.post('/moisture', (req, res) => {
        res.send({ moisture: moistureReading });
    });

    // Return the current user's garden pH level
    app.post('/gardenph', (req, res) => {
        var targetUser = req.body.user;

        var users = User.findAll({
            attributes: ['ph'],
            where: {
                id: { $eq: targetUser },
            },
            raw: true
        });

        users.then(function () {
            res.send(users._rejectionHandler0[0]);
        });
    });

    // Return the current plants inside user's garden
    app.post('/garden', (req, res) => {
        var targetGarden = req.body.garden;

        var query = "SELECT Plants.NAME AS name, Plants.IMAGE AS image FROM Gardens, Plants WHERE Gardens.PLANTID = Plants.ID AND Gardens.ID = " + targetGarden + ";";

        db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT })
            .then(function (gardens) {
                if (gardens != null) {
                    res.send({ plants: gardens });
                }
                else {
                    res.send({ plants: null });
                }
            })
    });

    // Return the current location of user's garden
    app.post('/gardenlocation', (req, res) => {
        var targetGarden = req.body.garden;

        var gardens = Garden.findAll({
            attributes: ['location'],
            where: {
                id: { $eq: targetGarden },
            },
            raw: true
        });

        gardens.then(function () {
            res.send(gardens._rejectionHandler0[0]);
        });
    });

    // Add a new garden to the database
    app.post('/gardeninsert', (req, res) => {
        var targetGarden = req.body.garden;
        var targetUser = req.body.user;
        var plants = req.body.plants;
        var location = req.body.location;
        var name = req.body.name;

        var plantArray = JSON.parse("[" + plants + "]");

        for (var i = 0; i < plantArray.length; i++) {
            var gardens = Garden.create({
                id: targetGarden,
                userid: targetUser,
                plantId: plantArray[i],
                location: location,
                name: name
            });
            gardens.then(function () {
                res.send("insertion complete");
            });
        }
    });

    // Return a list of all plants in the database
    app.post('/plantlist', (req, res) => {
        var plants = Plant.findAll({
            include: [{ all: true }],
            raw: true
        });

        if (plants != null) {
            plants.then(function () {
                res.send({ data: plants._rejectionHandler0 });
            });
        }
        else {
            res.send({ data: null });
        }
    });

    // Updates the moisture reading from the sensor
    app.post('/sensor', (req, res) => {
        moistureReading = req.body.moisture;

        res.send('success');
    });
}

module.exports = init;