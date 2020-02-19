/**
 *
 * @title:             PLanes de Pagos
 *
 * @author:            Javier Contreras
 * @email:             javier.contreras@altitudesolutions.org
 *
 * @description:       This code will handle request related to Planes de Pagos and Cuotas
 *
 **/

const express = require('express');
const app = express();

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');

// ===============================================
// Plan de Pagos related models
// ===============================================
const { EntidadFinanciera, TipoDeEntidad, EmpresaGrupo } = require('../Models/Finanzas/General');
const { LineasDeCredito } = require('../Models/Finanzas/LineasDeCredito');
const { PlanDePagos, CuotaPlanDePagos } = require('../Models/Finanzas/PlanDePagos');

app.post('/planDePagos', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_escribir')) {
        if (body.numeroDeContratoOperacion && body.monto && body.fechaFirma && body.moneda && body.plazo && body.frecuenciaDePagos && body.empresaGrupo && body.entidadFinanciera) {
            if (body.lineaDeCredito) {
                LineasDeCredito.findByPk(body.lineaDeCredito)
                .then(lineaDB => {
                    PlanDePagos.findAll({
                        where: {
                            lineaDeCredito: body.lineaDeCredito
                        }
                    })
                        .then(operaciones => {
                            let lineaDeCredito_creditLimit = lineaDB.toJSON().monto;

                            operaciones.forEach(element => {
                                let op_aux = element.toJSON();
                                lineaDeCredito_creditLimit -= op_aux.monto;
                            });

                            if(lineaDeCredito_creditLimit >= body.monto) {
                                if(lineaDB.fechaVencimiento >= body.fechaVencimiento) {
                                    PlanDePagos.create(body)
                                        .then(saved => {
                                            res.json({
                                                planDePagos: saved
                                            });
                                        }).catch(err => {
                                            res.status(500).json({
                                                err
                                            });
                                        });
                                }else{
                                    return res.status(400).json({
                                        err: {
                                            message: `La fecha de vencimiento de la línea de crédito es anterior que la finalización operación\nFecha de vencimiento: ${new Date(lineaDB.fechaVencimiento).getDate()}/${new Date(lineaDB.fechaVencimiento).getMonth()+1}/${new Date(lineaDB.fechaVencimiento).getFullYear()}`
                                        }
                                    });
                                }
                            }else{
                                return res.status(400).json({
                                    err: {
                                        message: `El saldo de la línea de crédito es insuficiente para sustentar esta operación\nSaldo: ${lineaDeCredito_creditLimit} ${lineaDB.moneda}`
                                    }
                                });
                            }
                        }).catch(err => {
                            return res.status(500).json({
                                err
                            });
                        });
                })
                .catch(err => {
                    return res.status(500).json({
                        err
                    });
                });
            } else {
                PlanDePagos.create(body)
                    .then(saved => {
                        res.json({
                            planDePagos: saved
                        });
                    }).catch(err => {
                        res.status(500).json({
                            err
                        });
                    });
            }
        } else {
            if (!body.numeroDeContratoOperacion) {
                res.status(400).json({
                    err: {
                        message: 'El número de contrato u operación es necesario'
                    }
                });
            } else {
                res.status(400).json({
                    err: {
                        message: 'El número de contrato u operación, el monto, la moneda, la fecha de firma, el plazo, la frecuencia de pagos, la entidad financiera y la empresa son necesarios'
                    }
                });
            }
        }
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});

app.post('/cuotaPlanDePagos', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.user;
    if (user.permisos.includes('fin_escribir')) {
        if (body.numeroDeCuota && body.fechaDePago && body.montoTotalDelPago && body.parent) {
            CuotaPlanDePagos.create(body)
                .then(saved => {
                    res.json({
                        cuotaPlanDePagos: saved
                    });
                }).catch(err => {
                    res.status(500).json({
                        err
                    });
                });
        } else {
            res.status(400).json({
                err: {
                    message: 'El plan de pagos asociado, el número de cuota, la fecha del pago y el monto son necesarios'
                }
            });
        }
    } else {
        res.status(403).json({
            err: {
                message: 'Acceso denegado'
            }
        });
    }
});


module.exports = app;