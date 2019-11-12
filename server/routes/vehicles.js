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
// Create vehicle
// ===============================================
app.post('/vehi', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('ve_escribir')) {
        if (body.movil && body.placa && body.tipoDeVehiculo && body.marca && body.modelo && body.anio) {
            // TODO: Verificar el formato del código y si es necesario
            body.codTipoDeVehiculo = `${body.placa}-${body.movil}`;
            let bodyContent = {
                keys: Object.keys(body),
                values: Object.values(body),
            };
            let query = sqlBuilder('insert', 'Vehiculos', bodyContent);
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
                    message: "El número de móvil, placa, tipo de vehículo, marca, modelo y año son necesarios"
                }
            });
        }
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para crear vehículos'
            }
        });
    }
});

// ===============================================
// Read vehi by id
// ===============================================
app.get('/vehi/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ve_leer')) {
        let arg = {
            id
        };
        if (req.query) {
            arg.params = req.query;
        }
        console.log(params);
        let bodyContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('select', 'Vehiculos', bodyContent);
        console.log(query);
        res.json({
            ok: true
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar vehículos'
            }
        });
    }
});

// ===============================================
// Get vehicles
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/vehi', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    if (user.permisos.includes('ve_leer')) {
        // TODO: define search params and info needed
        Vehiculo.find({}, 'movil placa tipo servicios')
            .skip(from)
            .limit(limit)
            .exec((err, vehicles) => {
                if (err) {
                    return res.status(400).json({
                        err
                    });
                }
                Vehiculo.countDocuments({}, (err, c) => {
                    res.json({
                        vehicles,
                        count: c
                    });
                });
            });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar vehículos'
            }
        });
    }
});

// ===============================================
// Update vehicle
// ===============================================
app.put('/vehi/:id', verifyToken, (req, res) => {
    let body = _.pick(req.body, ['movil', 'placa', 'tipo', 'servicios', 'codTipoDeVehiculo', 'descripcion',
        'cargaToneladas', 'cargaMetrocCubicos', 'litros', 'marca', 'modelo',
        'version', 'anio', 'cilindrada', 'traccion', 'peso', 'combustible', 'ruedas',
        'motor', 'turbo', 'chasis', 'serie', 'color'
    ]);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ve_leer')) {
        Vehiculo.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, dbVehi) => {
            if (err) {
                return res.status(400).json({
                    err
                });
            }
            res.json({
                vehicle: dbVehi
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar vehículos'
            }
        });
    }
});

// ===============================================
// Delete user
// ===============================================
app.delete('/vehi/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ve_borrar')) {
        Vehiculo.findByIdAndRemove(id, (err, deletedVehi) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (!deletedVehi) {
                return res.status(400).json({
                    err: {
                        message: 'Vehículo no encontrado'
                    }
                });
            }
            res.json({
                message: `El móvil con código ${deletedVehi.movil} ha sido eliminado`
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para borrar vehículos'
            }
        });
    }
});

// ===============================================
// Export routes
// ===============================================
module.exports = app;