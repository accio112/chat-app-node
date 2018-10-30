var socket = io();//req from client to server to make a connection and keep it open

socket.on('connect', function(){
    console.log('connected to server');

    // socket.emit('createEmail', {
    //     to:'divi@gmail.com',
    //     text: "doing just good"
    // })

    // socket.emit('createMessage', {
    //     to:'divi@gmail.com',
    //     text: "new message creation"
    // })
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newEmail', function (email) {
    console.log('new email', email);
})

socket.on('newMessage', function (msg) {
    console.log('New message arrived', msg);
})