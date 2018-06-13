require('dotenv').config()

const express = require('express');
const socket = require('socket.io');

const monitor = require("./monitor");

const app = express();

const server = app.listen(5000, function (){
    console.log('Listening on port 5000');
});

// Static files
app.use(express.static(__dirname+'/public'));

// Socket setup
var io = socket(server);

io.on('connection', function (socket){
    monitor(io);
});
