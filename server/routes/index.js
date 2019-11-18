/**
 *
 * @author:   Javier Contreras
 * @email:    javier.contreras@altitudesolutions.org
 *
 **/


const express = require('express');
const app = express();

app.use(require('./login'));
app.use(require('./users'));
app.use(require('./vehicles'));
app.use(require('./routes'));
app.use(require('./personnel'));
app.use(require('./estacionServicio'));
app.use(require('./registroDeHorarios'));


module.exports = app;