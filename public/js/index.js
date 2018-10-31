var socket = io();//req from client to server to make a connection and keep it open

socket.on('connect', function(){
    console.log('connected to server');

    // socket.emit('createEmail', {
    //     to:'divi@gmail.com',
    //     text: "doing just good"
    // })


});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newEmail', function (email) {
    console.log('new email', email);
});

socket.on('newMessage', function (msg) {
    console.log('New message arrived', msg);
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     to:'divi@gmail.com',
//     text: "new message creation"
// },function (data) {
//     console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    })
})