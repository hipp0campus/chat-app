const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const formatMessage = require('./utils/formatMessage');
const { 
  userJoin,
  getCurrentUser, 
  userLeave, 
  getRoomUsers
} = require('./utils/users');

app.use(express.static('../app/public'));

io.on('connection', (socket) => {
  socket.on('join_room', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    
    io.to(user.room).emit('room_users', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  })

  socket.on('new_message', (msg) => {
    const user = getCurrentUser(socket.id);

    socket.broadcast.emit('new_message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('room_users', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }

  });
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => console.log(`Listening on port ${PORT}...`));