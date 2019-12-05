/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/

const express = require('express');
const app = express();


const { verifyToken } = require('../middlewares/authentication');
const { construirPermisos, empaquetarPermisos } = require('../classes/Permisos');
let db = process.dbConnection;

// ===============================================
// Custom SQL service
// ===============================================
app.post('/sql', verifyToken, (req, res) => {
    // request body
    let user = req.user;


    user.permisos = empaquetarPermisos(user.permisos);

    // only users with all permissions can perform custom sql queries
    // TODO: verify custom query and if user has the rights to perform them
    if (user.nombreUsuario == 'root' || user.permisos == '1111 1111 1111 1111 1111 1111 1111 1111') {
        if (!req.body.query) {
            return res.status(400).json({
                err: {
                    message: 'No query was found'
                }
            });
        }

        db.query(req.body.query, (err, results, fields) => {
            if (err) {
                return res.status(500).json({
                    err
                });
            }
            res.json({
                results
            });
        })
    } else {
        res.status(403).json({
            err: {
                message: 'Sin autorizacion'
            }
        });
    }
});


module.exports = app;