const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// ===============================================
// tipos de vehiculos válidos
// ===============================================
let tipoDeVehiculo = {
    values: ['Carga Trasera', 'Carga Lateral', 'Volqueta', 'Roll On/Off', 'Cisterna', 'Furgon', 'Furgoneta', 'Barredora', 'Fregadora', 'Bus', 'Camioneta'],
    message: '{VALUE} no es un tipo de vehículo válido'
};

// ===============================================
// servicios válidos
// ===============================================
let tipoDeServicio = {
    values: ['Recoleccion', 'Transferencia', 'Lavado', 'Barrido Mecanizado', 'Transporte', 'Supervisión', 'Mantenimiento', 'Autosocorro', 'Administración'],
    message: '{VALUE} no es un servicio válido'
};

// ===============================================
// Zonas
// ===============================================
let listaZonas = {
    values: ['', '', '', ''],
    	message: ''
};



// ===============================================
// Modelo de empleado
// ===============================================
let Ruta = new mongoose.Schema({
    ruta: {
        type: String,
        required: [true, 'El nombre de la ruta es necesario'],
        unique: true
    },
    servicio: {
        type: String,
        enum: tipoDeServicio,
        required: [true, 'Al menos un servicio es necesario']
    },
    tipoVehiculos: {
        type: String,
        enum: tipoDeVehiculo,
        required: [true, 'Al menos un tipo de vehiculo es necesario']
    },
    referencia: {
        type: String,
        required: false
    },
    vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    zonaYTurno: {
        type: [Object],
        required: false
    },
    // zona: {
    //     type: String,
    //     required: false
    // },
    // turno: {
    //     type: String,
    //     required: false
    // },
    numeroRuta: {
        type: Number,
        required: false
    },
    frecuencia: {
        type: String,
        required: false
    },
    POA: {
        type: Boolean,
        required: false
    }
});

// ===============================================
// Validar los permisos del usuario
// ===============================================
Ruta.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// ===============================================
// Export Usuario model
// ===============================================
module.exports = mongoose.model('Ruta', Ruta);