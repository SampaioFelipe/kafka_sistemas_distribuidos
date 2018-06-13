require('dotenv').config()

const express = require('express')
const socket = require('socket.io');

const producer = require('./producer');

const app = express();

const server = app.listen(3000, function (){
    console.log('Listening on port 3000');
});

// Static files
app.use(express.static(__dirname+'/public'));

// Socket setup
var io = socket(server);

io.on('connection', function (socket){

    socket.on('chat', function (data){
        console.log(data);
        
        producer(data.message)
    });
});
