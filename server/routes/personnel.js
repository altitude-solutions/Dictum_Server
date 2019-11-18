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
        let arg = {
            searchParams: [
                ['idPersonal', id]
            ]
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
        let query = sqlBuilder('select', 'Personal', queryContent);
        db.query(query, 'Personal', (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (!results[0]) {
                return res.status(404).json({
                    err: {
                        message: 'Personal no encontrado'
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
        let body = _.pick(req.body, ['idPersonal', 'nombre', 'carnet', 'cargo', 'proyecto', 'turno', 'zona', 'subZona', 'ruta', 'supervisor', 'diasLaborales']);
        let arg = {
            bounds: [from, limit]
        };
        if (Object.entries(body).length > 0) {
            arg.searchParams = Object.entries(body);
        }
        if (Object.entries(req.query).length > 0) {
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
        let query = sqlBuilder('select', 'Personal', queryContent);
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
        let arg = {
            searchParams: [
                ['idPersonal', id]
            ]
        };
        if (Object.entries(body).length > 0) {
            arg.fields = body;
            let queryContent = {
                keys: Object.keys(arg),
                values: Object.values(arg)
            };
            let query = sqlBuilder('update', 'Personal', queryContent);
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
        }
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
        let arg = {
            searchParams: [
                ['idPersonal', id]
            ]
        };
        let queryContent = {
            keys: Object.keys(arg),
            values: Object.values(arg)
        };
        let query = sqlBuilder('delete', 'Personal', queryContent);
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
                message: 'No está autorizado para borrar personas'
            }
        });
    }
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;