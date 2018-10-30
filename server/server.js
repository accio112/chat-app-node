const path = require('path');
const http =  require('http');
const express = require('express');
const socketIO =  require('socket.io');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT ||3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log('New user connected');

    //create event
    socket.emit('newEmail', {
        from: 'mike@gmail.com',
        text: "how u doin?",
        createdAt: 124
    });

    //event listener
    // socket.on('createEmail', (newEmail)=>{
    //     console.log('Create email', newEmail);
    // })

    socket.on('createMessage', (newMsg)=>{
        console.log('Create msg', newMsg);
        //emits to everyone
        io.emit('newMessage', {
            from: newMsg.from,
            text: newMsg.text,
            createdAt: new Date().getTime()
        })
    })
    socket.on('disconnect', ()=>{
        console.log('Disconnected');
    })

});

server.listen(port,()=>{
    console.log(`Server is up on ${port}`);
})
