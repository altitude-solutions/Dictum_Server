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
app.post('/route', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('ru_escribir')) {
        if (body.ruta && body.servicio && body.tipoDeVehiculos) {
            let bodyContent = {
                keys: Object.keys(body),
                values: Object.values(body)
            };
            let query = sqlBuilder('insert', 'Rutas', bodyContent);
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
        let arg = {
            searchParams: [
                ['ruta', id]
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
        let queryContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('select', 'Rutas', queryContent);
        db.query(query, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                results: results[0]
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
        let body = _.pick(req.body, ['ruta', 'servicio', 'tipoDeVehiculos', 'referencia', 'vehiculo', 'zona', 'turno', 'numeroDeRuta', 'frecuencia', 'POA']);
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
        let queryContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('select', 'Rutas', queryContent);
        db.query(query, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            db.query('select count(*) from Rutas;', (err, counts, fie) => {
                res.json({
                    results,
                    count: results.length
                        // count: Number(counts[0][fields[0].name])
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
    let body = _.pick(req.body, ['ruta', 'servicio', 'tipoDeVehiculos', 'referencia', 'vehiculo', 'zona', 'turno', 'numeroDeRuta', 'frecuencia', 'POA']);
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('ru_modificar')) {
        let arg = {
            searchParams: [
                ['ruta', id]
            ]
        };
        if (Object.entries(body).length > 0) {
            arg.fields = body;
            let queryContent = {
                keys: Object.keys(arg),
                values: Object.values(arg)
            };
            let query = sqlBuilder('update', 'Rutas', queryContent);
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
        let arg = {
            searchParams: [
                ['ruta', id]
            ]
        };
        let queryContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('delete', 'Rutas', queryContent);
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
                message: 'No está autorizado para borrar rutas'
            }
        });
    }
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;