const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// ===============================================
// User model
// ===============================================
const Usuario = require('../Models/User');


// ===============================================
// Login service
// ===============================================
app.post('/login', (req, res) => {
    // request body
    let body = req.body;
    // verify if required fields are there, if not send bad request error
    if (!body.nombreUsuario || !body.contra) {
        return res.status(400).json({
            err: {
                message: 'El nombre de usuario y la contraseña son necesarios'
            }
        })
    }
    // Look for user in the database
    Usuario.findOne({ nombreUsuario: body.nombreUsuario }, (err, dbUser) => {
        // If an error occurs send internal server error
        if (err) {
            return res.status(500).json({
                err
            });
        }
        // If no user is found send not found error
        if (!dbUser) {
            return res.status(404).json({
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        // If the password does not match send not found error
        if (!bcrypt.compareSync(body.contra, dbUser.contra)) {
            return res.status(404).json({
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
        // If no error generate token and send it with a 200 status code
        let token = jwt.sign({
            user: dbUser
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            user: dbUser,
            token
        });

    });
});


module.exports = app;