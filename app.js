const axios = require('axios')
const express = require('express')
const app = express()

app.set('view engine', 'ejs') //set the template engine ejs
app.use(express.static('public')) //middlewares
app.get('/', (req, res) => { //routes
    res.render('index')
})

server = app.listen(3000) //Listen on port 3000

axios.defaults.baseURL = 'http://dev.lagacetand.com.ar/LG-News-LiveUpdate/demo_data/';

const io = require("socket.io")(server) //socket.io instantiation

io.on('connection', (socket) => { //listen on every connection

    console.log('New connection - ' + 'Socket ID: ' + socket.id)

    //const apiurl = 'http://dev.lagacetand.com.ar/LG-News-LiveUpdate/demo_data/'

    //listen on notaid
    socket.on('notaid', (data) => {
        //socket.notaid = data.notaid
        //shares = Math.floor(Math.random() * 100)
        //shares = JSON.parse(apiurl + 'shares.json?notaid=' + data.notaid)

        axios
            .get('shares.json', {
                params: {
                    notaid: data.notaid
                }
            })
            .then(response => {
                notaid = response.data.notaid
                shares = response.data.count
                io.sockets.to(socket.id).emit('update_shares', {shares : shares})

                console.log('Socket ID: ' + socket.id + ' - Nota ID: ' + notaid + ' - Shares: ' + shares)
                console.log(shares)
            })
            .catch(error => {
                console.log(error)
            });
    })






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
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })
    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })
})