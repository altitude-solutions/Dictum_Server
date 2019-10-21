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
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://127.0.0.1:27017/LPL' : process.env.MONGOURI;

mongoose.connect(process.env.URLDB, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true },
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
