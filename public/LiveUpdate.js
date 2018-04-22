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
    socket.on('shareCountUpdate', (data) => {
        let shareCount = document.querySelector('#shareCount')
        shareCount.textContent = 'Share Count: ' + data.shareCount
    })

    //Emit typing
    var commentsAlert = document.querySelector('#commentsAlert')
    var commentsBox = document.querySelector('#commentsBox')
    var commentsTextarea = document.querySelector('#commentsTextarea')

    commentsTextarea.addEventListener('keypress', () => {
        socket.emit('commentsAlert', {type: 'commentTyping'})
    })
    //Listen on commentsTyping
    socket.on('commentsAlert', (data) => {
        commentsAlert.innerHTML = data.message
    })




    //function commentsBoxUpdate(comments) {
        //let commentsBox = document.querySelector('#comments');
        //let commentsNew = ``

        //comments.forEach(function (comments) {

        //})

        //commentsBox.insertAdjacentHTML('afterbegin', commentsNew)
    //}


});