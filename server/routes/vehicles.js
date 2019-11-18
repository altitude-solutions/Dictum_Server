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
            if (!body.codTipoDeVehiculo) {
                body.codTipoDeVehiculo = null;
            }
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
            searchParams: [
                ['movil', id]
            ]
        };
        if (Object.keys(req.query).length > 0) {
            Object.entries(req.query).forEach(element => {
                if (element[0] == 'fields') {
                    element[1] = JSON.parse(element[1]);
                }
                arg[`${element[0]}`] = element[1];
            });
        }
        let bodyContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('select', 'Vehiculos', bodyContent);
        db.query(query, 'Vehiculos', (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (!results[0]) {
                return res.status(404).json({
                    err: {
                        message: 'Vehículo no encontrado'
                    }
                });
            }
            res.json({
                results: results[0]
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
// Get vehicles
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/vehi', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    if (user.permisos.includes('ve_leer')) {
        let body = _.pick(req.body, ['movil', 'placa', 'tipoDeVehiculo', 'servicios', 'codTipoDeVehiculo', 'descripcion',
            'cargaToneladas', 'cargaMetrocCubicos', 'cargaCombustible', 'marca', 'modelo',
            'version', 'anio', 'cilindrada', 'traccion', 'peso', 'combustible', 'ruedas',
            'motor', 'turbo', 'chasis', 'serie', 'color', 'conductor', 'conductor_2', 'numeroDeAyudantes'
        ]);
        let arg = {
            bounds: [from, limit]
        };
        if (Object.entries(body).length > 0) {
            arg.searchParams = Object.entries(body);
        }
        if (Object.keys(req.query).length > 0) {
            Object.entries(req.query).forEach(element => {
                if (element[0] == 'fields') {
                    element[1] = JSON.parse(element[1]);
                }
                arg[`${element[0]}`] = element[1];
            });
        }
        let bodyContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('select', 'Vehiculos', bodyContent);
        db.query(query, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            db.query('select count(*) from Vehiculos;', (err, counts, fields) => {
                res.json({
                    results,
                    count: Number(counts[0][fields[0].name]),
                    requestValue: "Lista de Vehiculos",
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
    let body = _.pick(req.body, ['movil', 'placa', 'tipoDeVehiculo', 'servicios', 'codTipoDeVehiculo', 'descripcion',
        'cargaToneladas', 'cargaMetrocCubicos', 'cargaCombustible', 'marca', 'modelo',
        'version', 'anio', 'cilindrada', 'traccion', 'peso', 'combustible', 'ruedas',
        'motor', 'turbo', 'chasis', 'serie', 'color', 'conductor', 'conductor_2', 'numeroDeAyudantes'
    ]);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ve_leer')) {
        let arg = {
            searchParams: [
                ['movil', id]
            ]
        }
        if (Object.entries(body).length > 0) {
            arg.fields = body;
            let bodyContent = {
                keys: Object.keys(arg),
                values: Object.values(arg)
            };
            let query = sqlBuilder('update', 'Vehiculos', bodyContent);
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
            return res.status(400).json({
                err: {
                    message: 'Nada que actualizar'
                }
            });
        }
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
        let arg = {
            searchParams: [
                ['movil', id]
            ]
        }
        let bodyContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('delete', 'Vehiculos', bodyContent);
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