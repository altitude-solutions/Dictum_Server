const express = require('express');
const app = express();

app.use( require('./login') );
app.use( require('./users') );
app.use( require('./vehicles') );
app.use( require('./routes') );
app.use( require('./personnel') );


module.exports = app;