const express = require('express');
const app = express();

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Registros de la estación de servicio
// ===============================================
const VentaCombustible = require('../Models/VentasCombustible');


app.post('/ventaCombustible', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;

    if (user.permisos.includes('es_escribir')) {
        body.precioTotal = Number(body.precioTotal);
        body.kilometraje = Number(body.kilometraje);
        body.volumen = Number(body.volumen);
        body.fecha = new Date(body.fecha);
        console.log(body);
        // let venta = new VentaCombustible(body);

        VentaCombustible.find({ vehiculo: body.vehiculo }, (err, dbVentas) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            console.log(dbVentas);
            res.json({
                dbVentas
            });
        });
    }
});


app.get('/ventaCombustible', verifyToken, (req, res) => {

});


module.exports = app;