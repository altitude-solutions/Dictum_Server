/**
 *
 * @title:             Registro de horarios
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       This code will handle http requests from clients using Operador de Radio App for LPL
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
const { RegistroDeHorarios, CicloDeHorarios, RegistroDeDatos_OR, RegistroDePenalidades, ListaDeDatos_OR } = require('../Models/OperadorDeRadio');


// ===============================================
// Get lista de datos
// ===============================================
app.get('/listaDeDatos_OR', verifyToken, (req, res) => {
    let offset = req.query.from || 0;
    let limit = req.query.to || 1000;
    let user = req.user;
    if (user.permisos.includes('or_leer')) {
        ListaDeDatos_OR.findAndCountAll({
            offset,
            limit
        }).then(reply => {
            res.json({
                listaDeDatos: reply.rows,
                count: reply.count
            });
        }).catch(err => {
            res.status(500).json({
                err
            });
        });
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});


// ===============================================
// Create Penalty
// ===============================================
app.post('/penalties', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_escribir')) {
        console.log(body);
        RegistroDePenalidades.create(body)
            .then(saved => {
                res.json({
                    penalidad: saved
                });
            }).catch(err => {
                res.status(500).json({
                    err
                });
            });
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});

// ===============================================
// Create Registro de Horarios
// ===============================================
app.post('/registroDeHorarios', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_escribir')) {
        // console.log(JSON.stringify(body).length, 'bytes');

        // console.log(new Date(Number(body[0].horarios[0].salida_base)).getTime());
        // console.log(new Date(Number(body[0].horarios[0].salida_base)));
        for (let i = 0; i < body.length; i++) {
            let registro = body[i];
            let horarios = body[i].horarios;
            delete registro.horarios;
            let registroKeys = Object.keys(registro);
            registroKeys.forEach(key => {
                if (registro[key] == '') {
                    registro[key] = null;
                }
            });
            RegistroDeHorarios.create(registro)
                .then(registroDB => {
                    for (let j = 0; j < horarios.length; j++) {
                        let element = horarios[j];
                        let keys = Object.keys(element);
                        for (let k = 0; k < keys.length; k++) {
                            if (element[keys[k]] == 14400000)
                                element[keys[k]] = null;
                        }
                        element.parent = registroDB.toJSON().id;
                        CicloDeHorarios.create(element)
                            .then(cicloDB => {
                                console.log(cicloDB);
                            }).catch(err => {
                                console.log(err);
                            });
                    }
                }).catch(err => {
                    console.log(err);
                });
        }

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

// ===============================================
// Create registro de datos
// ===============================================
app.post('/ragistroDeDatos', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('or_escribir')) {
        RegistroDeDatos_OR.create(body)
            .then(saved => {
                res.json({
                    horarios: saved
                });
            }).catch(err => {
                res.status(500).json({
                    err
                });
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