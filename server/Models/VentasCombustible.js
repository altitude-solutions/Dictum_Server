const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// ===============================================
// Lista de combustibles
// ===============================================
let listaCombustibles = {
    values: ['Gasolina', 'Diésel'],
    message: '{VALUE} no es un combustible válido'
};

// ===============================================
// Lista de objetivos
// ===============================================
let listaObjetivos = {
    values: ['Vehículo', 'Bidón'],
    message: '{VALUE} no es un objetivo válido'
}


// ===============================================
// Model
// ===============================================
let VentaCombustible = new mongoose.Schema({
    fecha: {
        type: Date,
        required: [true, 'La fecha y la hora son necesarias']
    },
    vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    kilometraje: {
        type: Number,
        required: false
    },
    volumen: {
        type: Number,
        required: [true, 'El volumen es necesario']
    },
    combustible: {
        type: 'String',
        enum: listaCombustibles,
        required: [true, 'El combustible es necesario']
    },
    precioTotal: {
        type: Number,
        required: [true, 'El importe es necesario']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'El usuario es necesario']
    },
    objetivo: {
        type: String,
        enum: listaObjetivos,
        required: [true, 'Es necesario saber si fue vehículo o bidon']
    }
});

// ===============================================
// Validar los permisos del usuario
// ===============================================
VentaCombustible.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// ===============================================
// Export Usuario model
// ===============================================
module.exports = mongoose.model('VentaCombustible', VentaCombustible);