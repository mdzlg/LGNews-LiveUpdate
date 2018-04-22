const axios = require('axios')
const express = require('express')
const app = express()

app.set('view engine', 'ejs') //set the template engine ejs
app.use(express.static('public')) //middlewares
app.get('/', (req, res) => { //routes
    res.render('nota')
})
app.get('/nota/:notaId', (req, res) => {
    res.render('nota')
    //var notaId = req.params.notaId
})

server = app.listen(3000, () =>{ console.log('Server: http://localhost:3000') }) //Listen on port 3000

axios.defaults.baseURL = 'http://localhost:3000/demo_data/';

const io = require("socket.io")(server) //socket.io instantiation

io.on('connection', (socket) => { //listen on every connection

    var notaId = socket.handshake.query['notaId']

    //console.log('New connection - ' + 'Socket ID: ' + socket.id)
    console.log('New connection - ' + 'Socket ID: ' + socket.id + ' - Nota ID: ' + notaId)
    //console.log(socket)

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('nota', (notaId) => {
        socket.join(notaId)
    })

    //listen on share
    socket.on('share', (data) => {
        //socket.notaId = notaId
        //share = Math.floor(Math.random() * 100)
        //share = JSON.parse(apiurl + 'share.json?notaId=' + notaId)

        axios
            .get('share.json', {
                params: {
                    notaId: notaId
                }
            })
            .then(response => {
                //notaId = response.data.notaId
                shareCount = response.data.count

                //io.sockets.to(socket.id).emit('shareCountUpdate', {shareCount: shareCount})
                io.sockets.to(notaId).emit('shareCountUpdate', {shareCount: shareCount})
                //io.sockets.emit('shareCountUpdate', {shareCount: shareCount})

                console.log('Socket ID: ' + socket.id + ' - Nota ID: ' + notaId + ' - ShareCount: ' + shareCount)
            })
            .catch(error => {
                console.log(error)
            });
    })

    //listen on Comments Typing
    socket.on('commentsAlert', (data) => {
        commentsAlert(data.type)
    })

    function commentsAlert(type) {
        let message

        switch (type) {
            case 'commentTyping':
                message = socket.id + ' esta escribiendo un comentario...'
                socket.broadcast.to(notaId).emit('commentsAlert', {message: message})

                console.log('Socket ID Typing: ' + socket.id)
            break;
            case 'commentsNewCount':
                message = 'Hay ' + '5' + ' comentarios nuevos...'
                io.sockets.to(notaId).emit('commentsAlert', {message: message})

                console.log('New comments for display: ' + '5');
            break;
            default:
                console.log('Sorry, no type defined.');
        }
    }












    //console.log('New user connected')
    //default username
    socket.username = "Anonymous"
    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })
    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message: data.message, username: socket.username});
    })
    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
})