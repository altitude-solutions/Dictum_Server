/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/

// ===============================================
// Port
// ===============================================
process.env.PORT = process.env.PORT || 3000;

// ===============================================
// Environment
// ===============================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============================================
// Database connection
// ===============================================

const mongoose = require('mongoose');
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb+srv://AltitudeSolutions:uevboKDe660C43Nc@pruebas-34upj.mongodb.net/LPL' : process.env.MONGOURI;

mongoose.connect(process.env.URLDB, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log('Error de conexión con la base de datos');
            throw err;
        } else {
            console.log('Base de datos ONLINE');
        }
    });


// ===============================================
// Token
// ===============================================
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '24h';

// ===============================================
// Token seed
// ===============================================
process.env.SEED = process.env.SEED || 'development-seed';

// ===============================================
// Maria DB connection
// ===============================================
const mysql = require('mysql');
let dictumConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'm4r14db-r00t-89',
    database: 'DICTUM'
});

dictumConnection.connect();

// let  = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'm4r14db-r00t-89',
//     database: 'LPL'
// });


// ===============================================
// Close conecionts
// ===============================================
let disconnectDB = () => {
    mongoose.disconnect(err => {
        if (err) {
            console.log('Could not disconnect from mongodb');
        } else {
            console.log('Disconnected');
        }
    });

    dictumConnection.end();
}

process.dbConnection = dictumConnection;

module.exports = {
    disconnectDB
    // lplConnectio
};