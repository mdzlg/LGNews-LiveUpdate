document.addEventListener('DOMContentLoaded', () => {

    console.log('DOM fully loaded and parsed')

    let notaId = window.location.pathname.split('/')[2]
    let socket = io.connect('http://localhost:3000', {query:"notaId=" + notaId}) //make connection

    socket.on('connect', () => {
        // Connected, let's sign-up for to receive messages for this nota
        socket.emit('nota', notaId)
    })

    //Emit a noda_id
    let share = document.querySelector('#share')

    share.addEventListener('click', () => {
        //socket.emit('share', {notaId : notaId})
        socket.emit('share')
    })
    //Listen on shareCountUpdate
    socket.on('shareCountUpdate', data => {
        document.querySelector('#shareCount').textContent = 'Compartida: ' + data.count + ' veces.'
    })

    //comments
    var commentsNewRequest = document.querySelector('#commentsNewRequest')

    //Listen on commentsNewRequest
    socket.on('commentsNewRequest', data => {
        document.querySelector('#commentsNewRequestTxt').innerHTML =  'Hay ' + data.count + ' comentarios nuevos...'
        commentsNewRequest.style.display = 'block'

        console.logdata
    })
    //Emit a commentUpdate
    document.querySelector('#commentsUpdate').addEventListener('click', () => {
        socket.emit('commentsUpdate')
        commentsNewRequest.style.display = 'none'
    })
    //Listen on commentsNewLoad
    socket.on('commentsNewLoad', data => {
        let comments = data.comments
        let commentsHTML = ''

        comments.forEach(comment => {
            if (comment.level == 2) {
                commentsHTML += '<p style="padding: 0 0 0 30px;">'
            } else {
                commentsHTML += '<p>'
            }
            commentsHTML += '<strong>' + comment.username + '</strong> - #' + comment.id + ' - Hace ' + comment.datetime + ' hs<br>' + comment.text + '<br>Like: ' + comment.like + ' - Unlike: ' + comment.unlike + '</p>'
        })
        document.querySelector('#commentsBox').insertAdjacentHTML('afterbegin', commentsHTML)
    })

    /*document.querySelector('#commentsTextarea').addEventListener('keypress', () => {
        socket.emit('commentsAlert', {type: 'commentTyping'})
    })*/
    //Listen on commentsAlert
    /*socket.on('commentsAlert', data => {
        commentsAlert.innerHTML = data.message
    })*/
});