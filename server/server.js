const path = require('path');
const http =  require('http');
const express = require('express');
const socketIO =  require('socket.io');
const publicPath = path.join(__dirname, '../public');
const {generateMessage} = require('./utils/message');
const port = process.env.PORT ||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected');

    //create event

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

    //event listener
    socket.on('createMessage', (newMsg)=>{
        console.log('Create msg', newMsg);
        //emits to everyone
        io.emit('newMessage', generateMessage(newMsg.from, newMsg.text ));

        //better way
        // socket.broadcast.emit('newMsg', {
        //     from: newMsg.from,
        //     text: newMsg.text,
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('disconnect', ()=>{
        console.log('Disconnected');
    })

});

server.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})
