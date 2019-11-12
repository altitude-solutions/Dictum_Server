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
// Employee model
// ===============================================
const Personal = require('../Models/Personal');

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Create user
// ===============================================
app.post('/personnel', (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('p_escribir')) {
        if (body.idPersonal && body.nombre && body.carnet && body.cargo && body.diasLaborales) {
            let personnel = new Personal(body);
            personnel.save((err, personnelDB) => {
                if (err) {
                    return res.status(500).json({
                        err
                    });
                }
                res.json({
                    persona: personnelDB
                });
            });
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
        Personal.findById(id, (err, personnelDB) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                persona: personnelDB
            });
        });
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
        // TODO: define search params
        Personal.find({}, 'idPersonal nombre carnet diasLaborales')
            .skip(from)
            .limit(limit)
            .exec((err, personas) => {
                if (err) {
                    return res.status(400).json({
                        err
                    });
                }
                Personal.countDocuments({}, (err, c) => {
                    res.json({
                        personas,
                        count: c
                    });
                });
            });
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
    let body = _.pick(req.body, ['ruta', 'servicio', 'tipoVehiculos', 'referencia', 'vehiculo', 'zonaYTurno', 'numeroRuta', 'frecuencia', 'POA']);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('p_modificar')) {
        Personal.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, dbPersonnel) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                persona: dbPersonnel
            });
        });
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
        Personal.findByIdAndRemove(id, (err, deletedPersonnel) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (!deletedPersonnel) {
                return res.status(400).json({
                    err: {
                        message: 'Persona no encontrada'
                    }
                });
            }
            res.json({
                message: `La persona con CI ${deletedPersonnel.carnet} ha sido eliminada`
            });
        });
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