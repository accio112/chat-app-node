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
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);


    // console.log('New message arrived', msg);
    // var li = jQuery('<li></li>');
    // li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
    //
    // jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     to:'divi@gmail.com',
//     text: "new message creation"
// },function (data) {
//     console.log('Got it', data);
// });

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    })

    jQuery('#messages').append(html);
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage',{
        from: 'User',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('')
    })
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation){
        return alert('Geolocation not suppoerted by your browser!');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location..');
    navigator.geolocation.getCurrentPosition(function (position){
        locationButton.removeAttr('disabled');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
        // console.log(position.coords.latitude, position.coords.longitude);
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
       alert('Unable to fetch location');
    });
})

