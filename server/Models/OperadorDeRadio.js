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
const { Personal, Supervisor } = require('./Personal');


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

RegistroDeHorarios.belongsTo(Usuario, {
    foreignKey: 'usuario'
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
    },
    modificaciones: {
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


// ===============================================
// Registro De Penalidades models
// ===============================================
class RegistroDePenalidades extends Model {};
class RegistroDeDatos_OR extends Model {};
class ListaDeDatos_OR extends Model {};
RegistroDePenalidades.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    item: {
        type: DataTypes.STRING
    },
    tipoDePenalidad: {
        type: DataTypes.STRING
    },
    detalle: {
        type: DataTypes.STRING(1023)
    },
    comentarios: {
        type: DataTypes.STRING(1023)
    },
    sigma: {
        type: DataTypes.STRING
    },
    horaDeRecepcion: {
        type: DataTypes.BIGINT
    },
    horaDeRespuesta: {
        type: DataTypes.BIGINT
    },
    respuesta: {
        type: DataTypes.STRING(1023)
    },
    horaDeContrarespuesta: {
        type: DataTypes.BIGINT
    },
    contrarespuesta: {
        type: DataTypes.STRING(1023)
    }
}, {
    sequelize: sql,
    timestamps: false,
    modelName: 'RegistroDePenalidades',
    tableName: 'RegistroDePenalidades'
});

RegistroDePenalidades.belongsTo(Ruta, {
    foreignKey: 'ruta'
});

RegistroDePenalidades.belongsTo(Vehiculo, {
    foreignKey: 'movil'
});

RegistroDePenalidades.belongsTo(Supervisor, {
    foreignKey: 'supervisor'
});

RegistroDePenalidades.belongsTo(Usuario, {
    foreignKey: 'usuario'
});

ListaDeDatos_OR.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dato: {
        type: DataTypes.STRING
    }
}, {
    sequelize: sql,
    timestamps: false,
    modelName: 'ListaDeDatos_OR',
    tableName: 'ListaDeDatos_OR'
});

RegistroDeDatos_OR.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    idDiario: {
        type: DataTypes.INTEGER
    },
    sigmaDeRecepcion: {
        type: DataTypes.STRING
    },
    horaDeRecepcion: {
        type: DataTypes.BIGINT
    },
    zona: {
        type: DataTypes.STRING(1023)
    },
    direccion: {
        type: DataTypes.STRING(1023)
    },
    cantidadPoda: {
        type: DataTypes.STRING
    },
    detalle: {
        type: DataTypes.STRING
    },
    comentarios: {
        type: DataTypes.STRING
    },
    tipoDeContenedor: {
        type: DataTypes.STRING
    },
    codigoDeContenedor: {
        type: DataTypes.STRING
    },
    Mantenimiento: {
        type: DataTypes.STRING
    },
    horaComunicacion: {
        type: DataTypes.BIGINT
    },
    horaEjecucion: {
        type: DataTypes.BIGINT
    },
    horaVerificacion: {
        type: DataTypes.BIGINT
    },
    horaConciliacion: {
        type: DataTypes.BIGINT
    },
    sigmaDeConciliacion: {
        type: DataTypes.STRING
    }
}, {
    sequelize: sql,
    timestamps: false,
    modelName: 'RegistroDeDatos_OR',
    tableName: 'RegistroDeDatos_OR'
});

RegistroDeDatos_OR.belongsTo(ListaDeDatos_OR, {
    foreignKey: 'dato'
});

RegistroDeDatos_OR.belongsTo(Personal, {
    foreignKey: 'responsableComunicacion'
});

RegistroDeDatos_OR.belongsTo(Personal, {
    foreignKey: 'responsableEjecucion'
});

RegistroDeDatos_OR.belongsTo(Supervisor, {
    foreignKey: 'supervisor'
});

RegistroDeDatos_OR.belongsTo(Usuario, {
    foreignKey: 'usuario'
});

sql.sync();

module.exports = {
    RegistroDeHorarios,
    CicloDeHorarios,
    RegistroDePenalidades,
    RegistroDeDatos_OR,
    ListaDeDatos_OR
}