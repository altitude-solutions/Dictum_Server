const { Sequelize } = require('sequelize');
const sql = new Sequelize('DICTUM', 'root', 'm4r14db-r00t-89', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

module.exports = {
    sql
}