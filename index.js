const app = require('express')();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

var users = [];
var socketIDS = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection', (socket) => {
    socket.on('new user', function (data) {
        if (users.indexOf(data) != -1) {
            socket.emit('new user', { success: false })
        } else {
            users.push(data);
            socketIDS.push(socket.id);
            socket.emit('new user', { success: true });

        }
    })
    socket.on('chat message', (obj) => {
        if (users.indexOf(obj.nome) != -1 && users.indexOf(obj.nome) == socketIDS.indexOf(socket.id)) {
            io.emit('chat message', obj);
        } else {
            console.log("No permission");
        }
    })

    socket.on('disconnect', () => {
        let id = socketIDS.indexOf(socket.id);
        socketIDS.splice(id, 1);
        users.splice(id, 1);
        console.log(socketIDS);
        console.log(users);
        console.log("user desconect");
    });

})


http.listen(3000, () => {

    console.log('listening on *:3000');

});