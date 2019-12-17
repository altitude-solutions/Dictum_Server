/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/

const express = require('express');
const app = express();
const _ = require('underscore');

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Personnel related models
// ===============================================
const { Personal } = require('../Models/Personal');

// ===============================================
// Create user
// ===============================================
app.post('/personnel', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('p_escribir')) {
        if (body.idPersonal && body.nombre && body.carnet && body.cargo && body.diasLaborales) {

        } else {
            res.status(400).json({
                err: {
                    message: "El ID, nombre, carnet, cargo y días laborales son necesarios"
                }
            });
        }
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para crear personas'
            }
        });
    }
});

// ===============================================
// Read user by id
// ===============================================
app.get('/personnel/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('p_leer')) {

    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar personas'
            }
        });
    }
});

// ===============================================
// Get users
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/personnel', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    if (user.permisos.includes('p_leer')) {

    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar personas'
            }
        });
    }
});

// ===============================================
// Update user
// ===============================================
app.put('/personnel/:id', verifyToken, (req, res) => {
    let body = _.pick(req.body, ['idPersonal', 'nombre', 'carnet', 'cargo', 'proyecto', 'turno', 'zona', 'subZona', 'ruta', 'supervisor', 'diasLaborales']);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('p_modificar')) {

    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para modificar personas'
            }
        });
    }
});

// ===============================================
// Delete user
// ===============================================
app.delete('/personnel/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('p_borrar')) {

    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para borrar personas'
            }
        });
    }
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;