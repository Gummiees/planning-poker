// loading all dependencies
const express = require('express');
const path = require('path');

//setting the port
const port = 8080;

// instancing
const app = express(); //default constructor
app.set('port', port);
//used 'public' folder to use external CSS and JS
app.use('/public', express.static(__dirname + "/public"));
//handling requests and responses by setting the Express framework
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

const http = require('http');
const server = http.Server(app); //to launch Express
server.listen(port, () => console.log("listening…"));

const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

//initializing framework
const players = {};
const games = {};

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function getRandomName() {
    const totalCharacters = 5;
    let number = getRandomNumber(10000).toString();
    while(number.length < totalCharacters) {
        number = "0" + number;
    }
    return number;
}

io.on('connection', (socket) => { //returns socket which is a piece of data that talks with server and client
    console.log("Someone has connected");
    players[socket.id] = {
        player_id: socket.id
    };
    socket.emit('actualPlayers', players); //sends info back to that socket and not to all the other sockets
    socket.broadcast.emit('new_player', players[socket.id]);
    // when player moves send data to others

    socket.on('player_moved', (movement_data) => {
        players[socket.id].x = movement_data.x;
        players[socket.id].y = movement_data.y;
        players[socket.id].angle = movement_data.angle;
        // send the data of movement to all players
        socket.broadcast.emit('enemy_moved', players[socket.id]);
    });

    //synchronizing shooting
    socket.on('new_bullet', (bullet_data) => {
        socket.emit('new_bullet', bullet_data);
        socket.broadcast.emit('new_bullet', bullet_data);
    });
    
    socket.on('disconnect',  () => {
        console.log("someone has disconnected");
        delete players[socket.id];
        socket.broadcast.emit('player_disconnect', socket.id);
    });
    
    socket.on('createRoom',  () => {
        console.log("someone has created a room");
        const roomName = getRandomName();
        games[roomName] = {
            players: [socket.id],
        };
        socket.emit('roomCreated', roomName);
    });
});