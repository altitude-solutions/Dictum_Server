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


app.post('/ventaCombustible', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;

    if (user.permisos.includes('es_escribir')) {
        body.precioTotal = Number(body.precioTotal);
        body.volumen = Number(body.volumen);
        body.fecha = new Date(body.fecha);

        let schema = '';
        let values = '';
        if (body.objetivo == 'Vehículo') {
            // Vehículo
            body.kilometraje = Number(body.kilometraje);
            schema += `fecha, vehiculo, kilometraje, volumen, combustible, precioTotal, usuario, objetivo, comentarios`;
            values += `${new Date(body.fecha).getTime()}, ${body.vehiculo}, ${body.kilometraje}, ${body.volumen},\
            ${body.combustible}, ${body.precioTotal}, ${body.usuario}, ${body.objetivo}, ${body.comentarios}`;
        } else {
            // Bidón
            schema += `fecha, volumen, combustible, precioTotal, usuario, objetivo, comentarios`;
            values += `${new Date(body.fecha).getTime()}, ${body.volumen},\
            ${body.combustible}, ${body.precioTotal}, ${body.usuario}, ${body.objetivo}, ${body.comentarios}`;
        }

        process.dbConnection.query(`INSERT INTO EstacionDeServicio (${schema}) values (${values})`, (err, results, fields) => {
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
});


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