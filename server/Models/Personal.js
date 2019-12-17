/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/


const { Model, DataTypes } = require('sequelize');
const { sql } = require('../config/sql');

// ===============================================
// External Models
// ===============================================
const { Proyecto } = require('./Proyectos');

/*
// ===============================================
// Turnos válidos
// ===============================================
let turnosValidos = {
    values: ['nocturno', 'diurno', 'vespertino'],
    message: '{VALUE} no es un turno válido'
}
// ===============================================
// Dias laborales
// ===============================================
let diasLaborales = {
    values: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    message: '{VALUE} no es un día válido'
}
*/


// ===============================================
// Personnel model
// ===============================================
class Personal extends Model {};
Personal.init({
    idPersonal: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    carnet: {
        type: DataTypes.STRING
    },
    cargo: {
        type: DataTypes.STRING
    },
    turno: {
        type: DataTypes.ENUM(['Nocturno', 'Diurno', 'Tarde'])
    },
    lugarDeTrabajo: {
        type: DataTypes.STRING
    },
    seccion: {
        type: DataTypes.STRING
    },
    diasLaborales: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize: sql,
    modelName: 'Personal',
    timestamps: false,
    tableName: 'Personal'
});

Personal.belongsTo(Proyecto, {
    foreignKey: 'proyecto'
});

Personal.belongsTo(Personal, {
    foreignKey: 'superior'
});


// ===============================================
// Export Personal model
// ===============================================
module.exports = {
    Personal
}