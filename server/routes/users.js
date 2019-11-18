/**
 *
 * @title:             Users
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       This code will handle http requests from "Sistemas LPL" to create, update, get and delete users
 *
 **/

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');
const { construirPermisos, empaquetarPermisos } = require('../classes/Permisos');

let saveUserToDB = (req, res, noUsers = false) => {
    let body = req.body;
    if (body.nombreUsuario && body.contra && body.ci) {
        body.contra = bcrypt.hashSync(body.contra, 10);
        if (noUsers) {
            body.permisos = '1111 1111 1111 1111 1111 1111';
        } else {
            if (body.permisos) {
                body.permisos = empaquetarPermisos(body.permisos);
            }
        }
        let schema = `nombreUsuario, permisos, contra, recuperacion, nombreReal`;
        let values = `"${body.nombreUsuario}", "${body.permisos}", "${body.contra}", "${body.ci}", "${body.nombreReal}"`;
        if (body.empresa) {
            schema += ', empresa',
                values += `, "${body.empresa}"`
        }
        process.dbConnection.query(`INSERT INTO Usuarios (${schema}) values (${values})`, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                results,
                fields
            });
        });
    }
};


// ===============================================
// Create user
// ===============================================
app.post('/users', (req, res) => {
    process.dbConnection.query('SELECT count(*) from Usuarios;', (err, results, fields) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }
        let len = Number(results[0][fields[0].name]);
        if (len >= 1) {
            let token = req.get('token');
            jwt.verify(token, process.env.SEED, (err, decoded) => {
                if (err) {
                    return res.status(400).json({
                        err: {
                            err,
                            message: 'Token inválido'
                        }
                    });
                }
                let user = decoded.user;
                if (user.permisos.includes('u_escribir')) {
                    saveUserToDB(req, res);
                } else {
                    return res.status(403).json({
                        err: {
                            message: 'No autorizado'
                        }
                    });
                }
            });
        } else {
            saveUserToDB(req, res, true);
        }
    });
});

// ===============================================
// Read user by id
// ===============================================
app.get('/users/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('u_leer')) {

        process.dbConnection.query(`select * from Usuarios where nombreUsuario="${id}"`, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            if (results[0]) {
                let dbUser = results[0];
                dbUser.permisos = construirPermisos(dbUser.permisos);
                delete dbUser.contra;
                return res.json({
                    user: dbUser
                });
            }
            res.status(404).json({
                err: {
                    message: `${id} no encontrado`
                }
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar usuarios'
            }
        });
    }
});

// ===============================================
// Get users
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/users', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    if (user.permisos.includes('u_leer')) {
        process.dbConnection.query(`select nombreUsuario, permisos, empresa, nombreReal from Usuarios limit ${from}, ${limit}`, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            for (let i = 0; i < results.length; i++) {
                results[i].permisos = construirPermisos(results[i].permisos);
            }
            process.dbConnection.query('SELECT count(*) from Usuarios;', (err, counts, fields) => {
                res.json({
                    results,
                    count: Number(counts[0][fields[0].name])
                });
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'No está autorizado para observar usuarios'
            }
        });
    }
});

// ===============================================
// Update user
// ===============================================
app.put('/users/:id', verifyToken, (req, res) => {
    let body = _.pick(req.body, ['permisos', 'contra', 'empresa', 'recuperacion', 'nombreReal']);
    let id = req.params.id;
    let user = req.user;

    let updateString = [];
    if (user.permisos.includes('u_modificar')) {
        if (body.contra) {
            body.contra = bcrypt.hashSync(body.contra, 10);
            updateString.push(`contra="${body.contra}"`);
        }
        if (body.nombreUsuario) {
            updateString.push(`nombreUsuario="${body.nombreUsuario}"`);
        }
        if (body.empresa) {
            updateString.push(`empresa="${body.empresa}"`);
        }
        if (body.recuperacion) {
            updateString.push(`recuperacion="${body.recuperacion}"`)
        }
        if (body.permisos) {
            body.permisos = empaquetarPermisos(body.permisos);
            updateString.push(`permisos="${body.permisos}"`);
        }
        if (body.nombreReal) {
            updateString.push(`nombreReal="${body.nombreReal}"`);
        }
        updateString = updateString.join(',');

        process.dbConnection.query(`update Usuarios set ${updateString} where nombreusuario="${id}"`, (err, results, fields) => {
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
                message: 'No está autorizado para modificar usuarios'
            }
        });
    }
});

// ===============================================
// Delete user
// ===============================================
app.delete('/users/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('u_borrar')) {
        process.dbConnection.query(`delete from Usuarios where nombreUsuario="${id}"`, (err, results, fields) => {
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
                message: 'No está autorizado para borrar usuarios'
            }
        });
    }
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;