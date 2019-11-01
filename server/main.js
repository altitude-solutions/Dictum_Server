// ===============================================
// Server main file
// ===============================================
// Config
let {disconnectDB} = require('./config/config');
// Express server
const express = require('express');
// Http server
const http = require('http');
// This app is an express server
const app = express();
// Body parser and node path
const bodyParser = require('body-parser');

// const path = require('path');        // to serve static pages


// socket server
let server = http.createServer(app);
// body parser config, body arrives as json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// do not use a public directory
// app.use(express.static(path.resolve(__dirname, '../public')));          // to serve static pages

// App routing service
app.use(require('./routes/index'));


// ============================
// REST SERVER (Services)
// ============================
server.listen(process.env.PORT, () => {
    console.log('Server online', process.env.PORT);
});

process.on('SIGINT', function() {
    disconnectDB();
    process.exit();
});