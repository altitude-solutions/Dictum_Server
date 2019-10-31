const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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

// ===============================================
// Modelo de empleado
// ===============================================
let Personal = new mongoose.Schema({
    idPersonal: {
        type: String,
        required: [true, 'El ID de la persona es necesario'],
        unique: true
    },
    nombre: {
        type: [String],
        required: [true, 'El nombre de la persona es necesario']
    },
    carnet: {
        type: String,
        required: [true, 'El carnet de la persona es necesario']
    },
    cargo: {
        type: String,
        required: [true, 'El cargo de la persona es necesaria']
    },
    proyecto: {
        type: String,
        required: false
    },
    turno: {
        type: String,
        required: false,
        enum: turnosValidos
    },
    zonaYRuta: {
        type: [Object],
        required: false
    },
    subZona: {
        type: String,
        required: false
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    diasLaborales: {
        type: [String],
        enum: diasLaborales,
        required: [true, 'Los dias laborales son necesarios']
    }
});

// ===============================================
// Validar los permisos del personal
// ===============================================
Personal.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// ===============================================
// Export Personal model
// ===============================================
module.exports = mongoose.model('Personal', Personal);