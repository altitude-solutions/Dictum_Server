/**
 *
 * @title:             Operador de Base
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       Operador de Base REST API LPL
 *
 **/


const express = require('express');
const app = express();

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');
const { OperadorBase } = require('../Models/OperadorBase');

app.post('/operadorBase', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    // console.log(body);
    if (user.permisos.includes('io_escribir')) {
        body.forEach(element => {
            console.log(element);
            let keys = Object.keys(element);
            keys.forEach(key => {
                if (element[key] == '') {
                    element[key] = null;
                }
            });

            OperadorBase.create(element)
                .then(saved => {

                }).catch(err => {
                    console.log(err);
                });
        });
        res.json({
            ok: true
        });
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});

module.exports = app;