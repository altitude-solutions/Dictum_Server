/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// ===============================================
// tipos de vehiculos válidos
// ===============================================
let tipoDeVehiculo = {
    values: ['Carga Trasera', 'Carga Lateral', 'Volqueta', 'Roll On/Off', 'Cisterna', 'Furgon', 'Furgoneta', 'Barredora', 'Fregadora', 'Bus', 'Camioneta'],
    message: '{VALUE} no es un tipo de vehículo válido'
}

// ===============================================
// servicios válidos
// ===============================================
let tipoDeServicio = {
    values: ['Recoleccion', 'Transferencia', 'Lavado', 'Barrido Mecanizado', 'Transporte', 'Supervisión', 'Mantenimiento', 'Autosocorro', 'Administración'],
    message: '{VALUE} no es un servicio válido'
}


// ===============================================
// Modelo de vehiculo
// ===============================================
let Vehiculo = new mongoose.Schema({
    movil: {
        type: String,
        required: [true, 'El número de móvil es necesario'],
        unique: true
    },
    placa: {
        type: String,
        required: [true, 'La placa del vehículo es necesaria'],
        unique: true
    },
    tipo: {
        type: String,
        enum: tipoDeVehiculo,
        required: [true, 'El tipo del vehículo es necesario']
    },
    servicios: {
        type: [String],
        enum: tipoDeServicio,
        required: false
    },
    codTipoDeVehiculo: {
        type: String,
        required: [true, 'El código del tipo de vehículo es necesario']
    },
    descripcion: {
        type: String,
        required: true
    },
    cargaToneladas: {
        type: Number,
        required: false
    },
    cargaMetrocCubicos: {
        type: Number,
        required: false
    },
    cargaLitros: {
        type: Number,
        required: false
    },
    marca: {
        type: String,
        required: [true, 'La marca es necesaria']
    },
    modelo: {
        type: String,
        required: [true, 'El modelo es necesario']
    },
    version: {
        type: String,
        required: false
    },
    anio: {
        type: Number,
        required: [true, 'El año del vehículo es necesario']
    },
    cilindrada: {
        type: Number,
        required: false
    },
    traccion: {
        type: String,
        required: false
    },
    peso: {
        type: Number,
        required: false
    },
    combustible: {
        type: String,
        required: [true, 'El combustible es necesario']
    },
    ruedas: {
        type: Number,
        required: [true, 'El número de ruedas es necesario']
    },
    motor: {
        type: String,
        required: false
    },
    turbo: {
        type: String,
        required: false
    },
    chasis: {
        type: String,
        required: [true, 'El chasis es necesario']
    },
    serie: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    }
});

// ===============================================
// Validar el tipo de vehiculo y el servicio que presta
// ===============================================
Vehiculo.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});


// ===============================================
// Export Usuario model
// ===============================================
module.exports = mongoose.model('Vehiculo', Vehiculo);