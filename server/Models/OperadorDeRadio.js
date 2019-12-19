/**
 *
 * @title:             Operador de radios registers
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       Operador de radio models
 *
 **/


const { Model, DataTypes } = require('sequelize');
// sequelize instance
const { sql } = require('../config/sql');

// ===============================================
// External models
// ===============================================
const { Vehiculo } = require('./Vehicle');
const { Ruta } = require('./Ruta');
const { Usuario } = require('./User');
const { Personal } = require('./Personal');


// ===============================================
// Registro de horarios models
// ===============================================
class RegistroDeHorarios extends Model {};
class CicloDeHorarios extends Model {};

RegistroDeHorarios.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ayudantes: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: sql,
    timestamps: false,
    modelName: 'RegistroDeHorarios',
    tableName: 'RegistroDeHorarios'
});


RegistroDeHorarios.belongsTo(Vehiculo, {
    foreignKey: 'movil'
});

RegistroDeHorarios.belongsTo(Ruta, {
    foreignKey: 'ruta'
});

RegistroDeHorarios.belongsTo(Personal, {
    foreignKey: 'conductor'
});



CicloDeHorarios.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    salidaBase: {
        type: DataTypes.BIGINT
    },
    inicioRuta: {
        type: DataTypes.BIGINT
    },
    finRuta: {
        type: DataTypes.BIGINT
    },
    abandonoRuta: {
        type: DataTypes.BIGINT
    },
    salidaRelleno: {
        type: DataTypes.BIGINT
    },
    ingresoRelleno: {
        type: DataTypes.BIGINT
    },
    inicioAmuerzo: {
        type: DataTypes.BIGINT
    },
    finalAlmuerzo: {
        type: DataTypes.BIGINT
    },
    regresoBase: {
        type: DataTypes.BIGINT
    },
    comentarios: {
        type: DataTypes.STRING(1023)
    }
}, {
    sequelize: sql,
    timestamps: false,
    modelName: 'CicloDeHorarios',
    tableName: 'CicloDeHorarios'
});

RegistroDeHorarios.hasMany(CicloDeHorarios, {
    foreignKey: 'parent'
});

module.exports = {
    RegistroDeHorarios,
    CicloDeHorarios
}