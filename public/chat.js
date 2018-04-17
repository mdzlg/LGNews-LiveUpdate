$(function(){
    //make connection
    var socket = io.connect('http://localhost:3000')

    //buttons and inputs
    var shares = $("#shares")
    var send_notaid = $("#send_notaid")

    //Listen on update_shares
    socket.on("update_shares", (data) => {
        shares.html("Shares: " + data.shares)
    })

    //Emit a noda_id
    send_notaid.click(function(){
        socket.emit('notaid', {notaid : '1515'})
    })




    //buttons and inputs
    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("#send_username")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })
    //Emit a username
    send_username.click(function(){
        socket.emit('change_username', {username : username.val()})
    })
    //Emit message
    send_message.click(function(){
        socket.emit('new_message', {message : message.val()})
    })
    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })
    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
    })
});