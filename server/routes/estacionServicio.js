/**
 *
 * @title:             Estacion de servicio
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


app.post('/ventaCombustible', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;

    if (user.permisos.includes('es_escribir')) {
        body.precioTotal = Number(body.precioTotal);
        body.volumen = Number(body.volumen);
        body.fecha = new Date(body.fecha).getTime();
        if (body.kilometraje) {
            body.kilometraje = Number(body.kilometraje);
        }
        let queryContent = {
            keys: Object.keys(body),
            values: Object.values(body)
        };
        let query = sqlBuilder('insert', 'EstacionDeServicio', queryContent);
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
        return res.status(403).json({
            err: {
                message: 'Sin autorización'
            }
        });
    }
});


// TODO: implementar estos servicios
app.get('/ventaCombustible', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 15;
    let user = req.user;
    res.status(501).json({});
});

app.get('/ventaCombustible/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});

app.put('/ventaCombustible/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});

app.delete('/ventaCombustible/:id', verifyToken, (req, res) => {
    let user = req.user;
    res.status(501).json({});
});


module.exports = app;