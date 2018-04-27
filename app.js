// src: https://medium.com/@noufel.gouirhate/build-a-simple-chat-app-with-node-js-and-socket-io-ea716c093088

const axios = require('axios')
const express = require('express')
const app = express()

app.set('view engine', 'ejs') //set the template engine ejs
app.use(express.static('public')) //middlewares
app.get('/', (req, res) => { //routes
    res.render('index')
})
app.get('/nota/:notaId', (req, res) => {
    res.render('nota')
})

//Listen on port 3000
server = app.listen(3000, () => {
    console.log('Server: http://localhost:3000')
})

axios.defaults.baseURL = 'http://localhost:3000/demo_data/';

const io = require("socket.io")(server) //socket.io instantiation

io.on('connection', socket => { //listen on every connection

    var notaId = socket.handshake.query['notaId']

    console.log('New connection - ' + 'Socket ID: ' + socket.id + ' - Nota ID: ' + notaId)

    // Define room
    socket.on('nota', notaId => {
        socket.join(notaId)
    })

    //listen on share
    socket.on('share', data => {
        axios
            .get('share.json', {
                params: {
                    notaId: notaId
                }
            })
            .then(response => {
                io.sockets.to(notaId).emit('shareCountUpdate', {count: response.data.count})

                console.log('Socket ID: ' + socket.id + ' - Nota ID: ' + notaId + ' - Share Count: ' + response.data.count)
            })
            .catch(error => {
                console.log(error)
            });
    })

    //listen on Comments Typing
    /*socket.on('commentsAlert', data => {
        commentsAlert(data.type)
    })*/

    //listen on Comments New Request
    /*socket.on('commentsNewRequest', data => {
        commentsAlert(data.type)
    })*/

    //Timer for comments New Request
    setTimeout( () => {
        commentsNewRequest()
    }, 5000)

    function commentsNewRequest() {
        //message = 'Hay ' + '5' + ' comentarios nuevos...'
        //io.sockets.to(notaId).emit('commentsAlert', {type: type, message: message})

        axios
            .get('commentsNewRequest.json', {
                params: {
                    notaId: notaId
                }
            })
            .then(response => {
                io.sockets.to(notaId).emit('commentsNewRequest', {count: response.data.count})

                console.log('Socket ID: ' + socket.id + ' - Nota ID: ' + notaId + ' - Comments New Count: ' + response.data.count)
            })
            .catch(error => {
                console.log(error)
            });
    }

    /*function commentsAlert(type) {
        switch (type) {
            case 'commentTyping':
                message = socket.id + ' esta escribiendo un comentario...'
                socket.broadcast.to(notaId).emit('commentsAlert', {type: type, message: message})

                console.log('Socket ID Typing: ' + socket.id)
            break;
            case 'commentsNewRequest':
                commentsNewRequest(type)
            break;
            default:
                console.log('Sorry, no type defined.')
        }
    }*/

    //listen on Comments Update
    socket.on('commentsUpdate', data => {
        axios
            .get('comments.json', {
                params: {
                    notaId: notaId
                }
            })
            .then(response => {
                io.sockets.to(socket.id).emit('commentsNewLoad', {comments: response.data.comments})

                console.log('Socket ID: ' + socket.id + ' - Nota ID: ' + notaId + ' - Comments New Load')
            })
            .catch(error => {
                console.log(error)
            });
    })










    //console.log('New user connected')
    //default username
    socket.username = "Anonymous"
    //listen on change_username
    socket.on('change_username', data => {
        socket.username = data.username
    })
    //listen on new_message
    socket.on('new_message', data => {
        //broadcast the new message
        io.sockets.emit('new_message', {message: data.message, username: socket.username});
    })
    //listen on typing
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
})