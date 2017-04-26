var db = require('../../config/database');
var sequelize = db.sequelize;
var Sequelize = db.Sequelize;

var Garden = sequelize.define('Gardens', {
    id: {
        type: Sequelize.INTEGER,
        field: 'ID',
        primaryKey: true
    },
    userid: {
        type: Sequelize.INTEGER,
        field: 'USERID'
    },
    plantId: {
        type: Sequelize.INTEGER,
        field: 'PLANTID'
    },
    location: {
        type: Sequelize.BOOLEAN,
        field: 'LOCATION'
    },
    name: {
        type: Sequelize.STRING,
        field: 'NAME'
    }
}, {
        freezeTableName: true,
        timestamps: false
    });

module.exports = Garden;