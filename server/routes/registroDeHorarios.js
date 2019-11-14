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
const { sqlBuilder } = require('../classes/SQLBuilder');
let db = process.dbConnection;


app.post('/registroDeHorarios', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('es_escribir')) {
        body.precioTotal = Number(body.precioTotal);
        body.volumen = Number(body.volumen);
        body.fecha = new Date(body.fecha);

        res.json({
            ok: true
        });
    } else {
        return res.status(403).json({
            err: {
                message: 'Sin autorización'
            }
        });
    }
});

// TODO: implementar estos servicios
app.get('/registroDeHorarios', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    res.status(501).json({});
});

app.get('/registroDeHorarios/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});

app.put('/registroDeHorarios/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});

app.delete('/registroDeHorarios/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});


module.exports = app;