/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// ===============================================
// User model
// ===============================================
// const Usuario = require('../Models/User');

const { construirPermisos } = require('../classes/Permisos');

// ===============================================
// Login service
// ===============================================
app.post('/login', (req, res) => {
    // request body
    let body = req.body;

    // verify if required fields are there, if not send bad request error
    if (!body.nombreUsuario || !body.contra) {
        return res.status(400).json({
            err: {
                message: 'El nombre de usuario y la contraseña son necesarios'
            }
        });
    }
    // Look for user in the database
    process.dbConnection.query(`select * from Usuarios where binary nombreUsuario="${body.nombreUsuario}"`, (err, results, fields) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }
        if (!results[0]) {
            return res.status(403).json({
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        let dbUser = results[0];
        if (!bcrypt.compareSync(body.contra, dbUser.contra)) {
            return res.status(403).json({
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        dbUser.permisos = construirPermisos(dbUser.permisos);

        delete dbUser.contra;
        delete dbUser.recuperacion;

        let token = jwt.sign({
            user: dbUser
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            user: dbUser,
            token
        })
    });
});

app.post('/recovery', (req, res) => {
    console.log(req.body);
    res.json({
        ok: true
    });
});

module.exports = app;