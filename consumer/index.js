require('dotenv').config()

const express = require('express')
const socket = require('socket.io');

const consumer = require('./consumer');

const app = express();

const server = app.listen(4000, function (){
    console.log('Listening on port 4000');
});

// Static files
app.use(express.static(__dirname+'/public'));

// Socket setup
var io = socket(server);

io.on('connection', function (socket){    
    consumer(io);
});
