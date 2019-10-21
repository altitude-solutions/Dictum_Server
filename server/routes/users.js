const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
// ===============================================
// Employee model
// ===============================================
const Usuario = require('../Models/User');

// ===============================================
// Middlewares
// ===============================================
const { verifyToken } = require('../middlewares/authentication');


// ===============================================
// Create user
// ===============================================
app.post('/users', (req, res) => {
    let body = req.body;
    if(body.nombreUsuario && body.contra && body.ci){
        let user = new Usuario({
            nombreUsuario: body.nombreUsuario,
            contra: bcrypt.hashSync(body.contra, 10),
            recuperacion: body.ci
        });
        if(body.permisos){
            user.permisos = body.permisos;
        }
        user.save((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    err
                });
            }
            res.json({
                user: userDB
            });
        });
    }else{
        res.status(400).json({
            err: {
                message: "El nombre del uuario y contraseña son necesarios"
            }
        });
    }
});

// ===============================================
// Read user by id
// ===============================================
app.get('/users/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Usuario.findById(id, (err, dbUser)=>{
        if(err) {
            return res.status(500).json({
                err
            });
        }
        res.json({
            user: dbUser
        });
    });
});

// ===============================================
// Get users
// Optional pagination
// Default 15 users from 0
// ===============================================
app.get('/users', verifyToken, (req, res) => {
    let from = Number(req.params.from) || 0;
    let limit = Number(req.params.to) || 15;
    // TODO: define search params
    Usuario.find({}, 'name permisos empresa')
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {
            if(err){
                return res.status(400).json({
                    err
                });
            }
            Usuario.countDocuments({}, (err, c) => {
                res.json({
                    users,
                    count: c
                });
            });
        });
});

// ===============================================
// Update user
// ===============================================
app.put('/users/:id', verifyToken, (req, res) => {
    let body = _.pick(req.body, ['nombreUsuario', 'permisos', 'contra', 'empresa']);
    let id = req.params.id;

    if(body.contra) {
        body.contra = bcrypt.hashSync(body.contra, 10);
    }

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, dbUser) => {
        if(err){
            return res.status(400).json({
                err
            });
        }
        res.json({
            user: dbUser
        });
    });
});

// ===============================================
// Delete user
// ===============================================
app.delete('/users/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, deletedUser)=> {
        if(err){
            return res.status(500).json({
                err
            });
        }
        if(!deletedUser){
            return res.status(400).json({
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            message: `La cuenta de ${deletedUser.name} ha sido eliminada`
        });
    });
});


// ===============================================
// Export routes
// ===============================================
module.exports = app;