const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// ===============================================
// Permisos válidos
// ===============================================
let validEmployeeRoles = {
    values: ['es_leer', 'es_escribir', 'es_borrar', 'es_modificar', 'or_leer', 'or_escribir', 'or_borrar', 'or_modificar', 'u_leer', 'u_escribir', 'u_borrar', 'u_modificar'],
    message: '{VALUE} no es un permiso válido'
}

// ===============================================
// Modelo de empleado
// ===============================================
let Usuario = new mongoose.Schema({
    nombreUsuario: {
        type: String,
        required: [true, 'El nombre del usuario es necesario'],
        unique: true  
    },
    permisos: {
        type: [String],
        enum: validEmployeeRoles
    },
    contra: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    recuperacion: {
        type: String,
        required: [true, 'La clave de recuperación es necesaria']
    },
    empresa: {
        type: String,
        required: false
    }
});

// ===============================================
// Validar los permisos del usuario
// ===============================================
Usuario.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// ===============================================
// Remove password and recovery code
// ===============================================
Usuario.methods.toJSON = function() {
    let Employee = this;
    let EmployeeObj = Employee.toObject();
    delete EmployeeObj.contra;
    delete EmployeeObj.recuperacion
    return EmployeeObj;
};

// ===============================================
// Export Usuario model
// ===============================================
module.exports = mongoose.model('Usuario', Usuario);