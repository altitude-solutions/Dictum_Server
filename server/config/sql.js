const { Sequelize } = require('sequelize');
const sql = new Sequelize('DICTUM', 'root', 'm4r14db-r00t-89', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
    dialectOptions: {
        timezone: 'Etc/GMT0' //for writing to database
    }
});

module.exports = {
    sql
}