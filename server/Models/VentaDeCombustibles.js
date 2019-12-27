/**
 *
 * @title:             Venta de Combustibles
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       Venta de Combustibles Models
 *
 **/

// Sequelize instance
const { sql } = require('../config/sql');
// Sequelize model and datatypes
const { Model, DataTypes } = require('sequelize');

// Related models
const { Vehiculo } = require('./Vehicle');
const { Usuario } = require('./User');


// ===============================================
// Venta de combustible model
// ===============================================
class VentaDeCombustible extends Model {};
VentaDeCombustible.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

}, {
    tableName: 'VentaDeCombustible',
    modelName: 'VentaDeCombustible',
    timestamps: false,
    sequelize: sql
});


sql.sync();

module.exports = {
    VentaDeCombustible
};