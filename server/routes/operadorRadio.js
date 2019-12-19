/**
 *
 * @title:             Registro de horarios
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       This code will handle http requests from clients at Service Station for LPL
 *
 **/


const express = require('express');
const app = express();

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Operador de radio related models
// ===============================================
const { RegistroDeHorarios, CicloDeHorarios } = require('../Models/OperadorDeRadio');

app.post('/penalties', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_escribir')) {
        console.log(body);
        res.json({
            body
        });
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});

app.put('/penalties/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_modificar')) {
        res.json({
            body
        });
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});

app.post('/registroDeHorarios', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_escribir')) {
        res.json({
            body
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