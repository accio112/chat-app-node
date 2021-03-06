var socket = io();//req from client to server to make a connection and keep it open

function scrollToBottom(){
    //selectors

    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages. prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight(); //why?

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // console.log('should scroll')
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){
    // console.log('connected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (error) {
        if(error){
            alert(error);
            window.location.href = '/';
        }
        else{
            console.log('No error');
        }
    })

});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
   // console.log('Users list', users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
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
    scrollToBottom();

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
    scrollToBottom();
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

