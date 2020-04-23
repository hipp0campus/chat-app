const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('../app/public'));

let users = [{ users: 'Emil' }];

app.get('/users', (req, res) => {
  res.send({ users });
});

io.on('connection', (socket) => {
  // socket --> endast clienten
  // io --> alla clienter
  // broadcast --> alla clienter förutom sändaren

  socket.broadcast.emit('users', 'A user has joined the chat.');

  socket.on('disconnect', () => {
    io.emit('users', 'A user has left the chat.')
  });

  socket.on('new_message', (msg) => {
    socket.broadcast.emit('new_message', msg);
  });


});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => console.log(`Listening on port ${PORT}...`));