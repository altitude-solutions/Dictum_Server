/**
 *
 * @title:             Models Operador Base
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       Model
 *
 **/

const { sql } = require('../config/sql');
const { Vehiculo } = require('./Vehicle');
const { Personal } = require('./Personal');
const { Usuario } = require('./User');
const { DataTypes, Model } = require('sequelize');


class OperadorBase extends Model {};
OperadorBase.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    kilometrajeSalida: {
        type: DataTypes.FLOAT
    },
    kilometrajeEntrada: {
        type: DataTypes.FLOAT
    },
    fecha: {
        type: DataTypes.BIGINT
    }
}, {
    tableName: 'registro_de_operador_base',
    modelName: 'registro_de_operador_base',
    timestamps: false,
    sequelize: sql
});

OperadorBase.belongsTo(Vehiculo, {
    foreignKey: 'movil'
});

OperadorBase.belongsTo(Personal, {
    foreignKey: 'conductor'
})
OperadorBase.belongsTo(Personal, {
    foreignKey: 'ayudante_1'
});

OperadorBase.belongsTo(Personal, {
    foreignKey: 'ayudante_2'
});

OperadorBase.belongsTo(Personal, {
    foreignKey: 'ayudante_3'
});

OperadorBase.belongsTo(Usuario, {
    foreignKey: 'usuario'
});

module.exports = {
    OperadorBase
};