/**
 *
 * @title:             Finanzas REST API
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       This code will handle requests from Finanzas App for LPL
 *
 **/

// ===============================================
// Server imports
// ===============================================
const express = require('express');
const app = express();

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Model imports
// ===============================================
const { LineasDeCredito } = require('../Models/Finanzas/LineasDeCredito');
const { EmpresaGrupo, EntidadFinanciera, TipoDeEntidad } = require('../Models/Finanzas/General');

// ===============================================
// Create Tipo Entidad
// ===============================================
app.post('/entidadFinanciera', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_escribir')) {
        EntidadFinanciera.create(body)
            .then(saved => {
                res.json({
                    entidadFinanciera: saved
                });
            })
            .catch(err => {
                if (err) {
                    return res.status(500).json({
                        err
                    });
                }
            });
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

// ===============================================
// Get Entidad by id
// ===============================================
app.get('/entidadFinanciera/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('fin_leer')) {
        EntidadFinanciera.findByPk(id)
            .then(entidadFinanciera => {
                if (!entidadFinanciera) {
                    return res.status(404).json({
                        err: {
                            message: 'Entidad financiera no encontrada'
                        }
                    });
                }

                res.json({
                    entidadFinanciera
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
// Get entidades financieras
// ===============================================
app.get('/entidadFinanciera', verifyToken, (req, res) => {
    let offset = Number(req.query.from) || 0;
    let limit = Number(req.query.to) || 100;
    let where = {};
    if (req.query.status) {
        let status = Number(req.query.status)
        where.estado = status
    }
    let user = req.user;
    if (user.permisos.includes('fin_leer')) {
        EntidadFinanciera.findAndCountAll({
            offset,
            limit,
            where,
            include: [{
                model: TipoDeEntidad
            }]
        }).then(reply => {
            res.json({
                entidades: reply.rows,
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
// Update entidad financiera
// ===============================================
app.put('/entidadFinanciera/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_modificar')) {
        res.json({
            id,
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

// ===============================================
// Delte entidad financiera
// ===============================================
app.delete('/entidadFinanciera/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('fin_borrar')) {
        res.json({
            id
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
// Get tipos de entidad
// ===============================================
app.get('/tipo_entidad', verifyToken, (req, res) => {
    let offset = req.query.from || 0;
    let limit = req.query.to || 100;
    let where = {};
    if (req.query.status) {
        let status = Number(req.query.status)
        where.estado = status
    }
    let user = req.user;

    if (user.permisos.includes('fin_leer')) {
        TipoDeEntidad.findAndCountAll({
            offset,
            limit,
            where
        }).then(reply => {
            res.json({
                tiposDeEntidad: reply.rows,
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
// Get empresas
// ===============================================
app.get('/empresas', verifyToken, (req, res) => {
    let offset = req.query.from || 0;
    let limit = req.query.to || 100;
    let where = {};
    if (req.query.status) {
        let status = Number(req.query.status)
        where.estado = status
    }
    let user = req.user;
    if (user.permisos.includes('pro_leer')) {
        EmpresaGrupo.findAndCountAll({
            offset,
            limit,
            where
        }).then(reply => {
            res.json({
                empresas: reply.rows,
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

app.post('/lineaDeCredito', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_escribir')) {
        LineasDeCredito.findAll({
            where: {
                codigo: body.codigo
            }
        }).then(lineaExistente => {
            if (!lineaExistente[0]) {
                LineasDeCredito.create(body)
                    .then(lineaDB => {
                        res.json({
                            lineaDeCredito: lineaDB
                        });
                    }).catch(err => {
                        res.status(500).json({
                            err
                        });
                    });
            } else {
                res.status(400).json({
                    err: {
                        message: 'El código de la lÍnea de crédito ya existe'
                    }
                });
            }
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
// Get Línea de crédito by id
// ===============================================
app.get('/lineaDeCredito/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('fin_leer')) {
        LineasDeCredito.findByPk(id, {
            include: [{
                model: EntidadFinanciera,
                include: [{
                    model: TipoDeEntidad
                }]
            }, {
                model: EmpresaGrupo
            }]
        }).then(lineaDB => {
            if (!lineaDB) {
                return res.status(404).json({
                    err: {
                        message: 'No encontrado'
                    }
                });
            }
            res.json({
                lineaDeCredito: lineaDB
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
// Get líneas de crédito
// ===============================================
app.get('/lineaDeCredito', verifyToken, (req, res) => {
    let offset = req.query.from || 0;
    let limit = req.query.to || 1000;
    let where = {};
    if (req.query.status) {
        let status = Number(req.query.status)
        where.estado = status
    }
    if (req.query.entidad) {
        where.entidad = Number(req.query.entidad);
    }
    let user = req.user;
    if (user.permisos.includes('fin_leer')) {
        LineasDeCredito.findAndCountAll({
            offset,
            limit,
            where,
            include: [{
                model: EntidadFinanciera,
                include: [{
                    model: TipoDeEntidad
                }]
            }, {
                model: EmpresaGrupo
            }]
        }).then(reply => {
            res.json({
                lineasDeCredito: reply.rows,
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
// Update línea de crédito
// ===============================================
app.put('/lineaDeCredito/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_modificar')) {
        LineasDeCredito.update(body, {
            where: {
                id
            }
        }).then(affected => {
            res.json({
                affected
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
// Delete línea de crédito
// ===============================================
app.delete('/lineaDeCredito/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let user = req.user;
    if (user.permisos.includes('fin_borrar')) {
        LineasDeCredito.update({
            estado: false
        }, {
            where: {
                id
            }
        }).then(affected => {
            res.json({
                affected
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