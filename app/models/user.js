var db = require('../../config/database');
var sequelize = db.sequelize;
var Sequelize = db.Sequelize;

var User = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        field: 'ID',
        primaryKey: true
    },
    ph: {
        type: Sequelize.FLOAT,
        field: 'GARDEN_PH'
    }
}, {
        freezeTableName: true,
        timestamps: false
    });

module.exports = User;