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
const { sqlBuilder } = require('../classes/SQLBuilder');

let db = process.dbConnection;

// ===============================================
// Create user
// ===============================================
app.post('/personnel', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('p_escribir')) {
        if (body.idPersonal && body.nombre && body.carnet && body.cargo && body.diasLaborales) {
            let bodyContent = {
                keys: Object.keys(body),
                values: Object.values(body)
            };
            let query = sqlBuilder('insert', 'Personal', bodyContent);
            db.query(query, (err, results, fields) => {
                if (err) {
                    return res.status(500).json({
                        err
                    });
                }
                res.json({
                    results
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