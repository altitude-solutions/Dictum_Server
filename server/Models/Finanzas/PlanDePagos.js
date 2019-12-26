/**
 *
 * @title:             Planes de pago
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       Planes de pago Models, Plan de pagos y cuotas
 *
 **/

const { Model, DataTypes } = require('sequelize');
const { sql } = require('../../config/sql');

// ===============================================
// Externale models
// ===============================================
const { EmpresaGrupo, EntidadFinanciera } = require('./General');
const { LineasDeCredito } = require('./LineasDeCredito');

// ===============================================
// Plan de pagos model
// ===============================================
class PlanDePagos extends Model {};
PlanDePagos.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    numeroDeContratoOperacion: {
        type: DataTypes.STRING
    },
    fechaFirma: {
        type: DataTypes.BIGINT
    },
    concepto: {
        type: DataTypes.STRING(1023)
    },
    detalle: {
        type: DataTypes.STRING(1023)
    },
    moneda: {
        type: DataTypes.STRING
    },
    monto: {
        type: DataTypes.FLOAT
    },
    iva: {
        type: DataTypes.FLOAT
    },
    cuotaInicial: {
        type: DataTypes.FLOAT
    },
    tipoDeTasa: {
        type: DataTypes.STRING
    },
    interesFijo: {
        type: DataTypes.FLOAT
    },
    interesVariable: {
        type: DataTypes.FLOAT
    },
    plazo: {
        type: DataTypes.INTEGER
    },
    frecuenciaDePagos: {
        type: DataTypes.STRING
    },
    fechaVencimiento: {
        type: DataTypes.BIGINT
    },
    fechaDesembolso_1: {
        type: DataTypes.BIGINT
    },
    montoDesembolso_1: {
        type: DataTypes.FLOAT
    },
    fechaDesembolso_2: {
        type: DataTypes.BIGINT
    },
    montoDesembolso_2: {
        type: DataTypes.FLOAT
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize: sql,
    timestamps: false,
    tableName: 'PlanesDePago',
    modelName: 'PlanesDePago'
});

PlanDePagos.belongsTo(LineasDeCredito, {
    foreignKey: 'lineaDeCredito'
});

PlanDePagos.belongsTo(EmpresaGrupo, {
    foreignKey: 'empresaGrupo'
});

PlanDePagos.belongsTo(EntidadFinanciera, {
    foreignKey: 'entidadFinanciera'
});


// ===============================================
// Cuota model
// ===============================================
class CuotaPlanDePagos extends Model {};
CuotaPlanDePagos.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    numeroDeCuota: {
        type: DataTypes.INTEGER
    },
    fechaDePago: {
        type: DataTypes.BIGINT
    },
    montoTotalDelPago: {
        type: DataTypes.FLOAT
    },
    pagoDeCapital: {
        type: DataTypes.FLOAT
    },
    pagoDeInteres: {
        type: DataTypes.FLOAT
    },
    pagoDeIva: {
        type: DataTypes.FLOAT
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize: sql,
    timestamps: false,
    tableName: 'CuotasDelPlanDePagos',
    modelName: 'CuotasDelPlanDePagos'
});

CuotaPlanDePagos.belongsTo(PlanDePagos, {
    foreignKey: 'parent'
});

// ===============================================
// Export models
// ===============================================
module.exports = {
    PlanDePagos,
    CuotaPlanDePagos
};