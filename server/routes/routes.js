const express = require('express');
const app = express();
const _ = require('underscore');
// ===============================================
// Employee model
// ===============================================
const Ruta = require('../Models/Ruta');

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Create user
// ===============================================
app.post('/route', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('ru_escribir')) {
        if (body.ruta && body.servicio && body.tipoVehiculos) {
            let route = new Ruta(body);
            route.save((err, routeDB) => {
                if (err) {
                    return res.status(500).json({
                        err
                    });
                }
                res.json({
                    ruta: routeDB
                });
            });
        } else {
            res.status(400).json({
                err: {
                    message: "El código de la ruta, servicio, tipo de vehículo son necesarios"
                }
            });
        }
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para crear rutas'
            }
        });
    }
});

// ===============================================
// Read user by id
// ===============================================
app.get('/route/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ru_leer')) {
        Ruta.findById(id, (err, dbRoute) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                ruta: dbRoute
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar rutas'
            }
        });
    }
});

// ===============================================
// Get users
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/route', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    if (user.permisos.includes('ru_leer')) {
        // TODO: define search params
        Ruta.find({}, 'ruta servicio tipoVehiculos referencia')
            .skip(from)
            .limit(limit)
            .exec((err, routes) => {
                if (err) {
                    return res.status(400).json({
                        err
                    });
                }
                Ruta.countDocuments({}, (err, c) => {
                    res.json({
                        routes,
                        count: c
                    });
                });
            });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar rutas'
            }
        });
    }
});

// ===============================================
// Update user
// ===============================================
app.put('/route/:id', verifyToken, (req, res) => {
    let body = _.pick(req.body, ['ruta', 'servicio', 'tipoVehiculos', 'referencia', 'vehiculo', 'zonaYTurno', 'numeroRuta', 'frecuencia', 'POA']);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ru_modificar')) {
        Ruta.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, dbRoute) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                ruta: dbRoute
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para modificar rutas'
            }
        });
    }
});

// ===============================================
// Delete user
// ===============================================
app.delete('/route/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ru_borrar')) {
        Ruta.findByIdAndRemove(id, (err, deletedRoute) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (!deletedRoute) {
                return res.status(400).json({
                    err: {
                        message: 'Ruta no encontrada'
                    }
                });
            }
            res.json({
                message: `La ruta ${deletedRoute.ruta} ha sido eliminada`
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para borrar rutas'
            }
        });
    }
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;