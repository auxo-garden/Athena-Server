var db = require('../../config/database');
var sequelize = db.sequelize;
var Sequelize = db.Sequelize;

var Plant = sequelize.define('Plants', {
    id: {
        type: Sequelize.INTEGER,
        field: 'ID',
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        field: 'NAME'
    },
    binomial: {
        type: Sequelize.STRING,
        field: 'LATIN_NAME'
    },
    sunlight: {
        type: Sequelize.STRING,
        field: 'SUNLIGHT_REQ'
    },
    soil: {
        type: Sequelize.STRING,
        field: 'SOIL_REQ'
    },
    water: {
        type: Sequelize.INTEGER,
        field: 'WEEKLY_WATER_IN'
    },
    height: {
        type: Sequelize.INTEGER,
        field: 'HEIGHT_IN'
    },
    spread: {
        type: Sequelize.INTEGER,
        field: 'SPREAD_IN'
    },
    germinate: {
        type: Sequelize.INTEGER,
        field: 'DAYS_TO_GERMINATE'
    },
    space: {
        type: Sequelize.INTEGER,
        field: 'SPACE_REQ_IN'
    },
    growTime: {
        type: Sequelize.INTEGER,
        field: 'DAYS_TO_GROW'
    },
    minTemp: {
        type: Sequelize.INTEGER,
        field: 'MIN_TEMPERATURE'
    },
    maxTemp: {
        type: Sequelize.INTEGER,
        field: 'MAX_TEMPERATURE'
    },
    location: {
        type: Sequelize.BOOLEAN,
        field: 'LOCATION'
    },
    image: {
        type: Sequelize.STRING,
        field: 'IMAGE'
    }
}, {
        freezeTableName: true,
        timestamps: false
    });

module.exports = Plant;