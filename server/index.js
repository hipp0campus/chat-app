const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { getClient, getDB, createObjectId } = require('./db');

const formatMessage = require('./utils/formatMessage');
const { 
  userJoin,
  getCurrentUser, 
  userLeave, 
  getRoomUsers
} = require('./utils/users');

app.use(express.static('../app/public'));
app.use(express.json());

app.get('/chatroom/:room/', (req, res) => {
  const room = req.params.room;

  const db = getDB();

  db.collection('rooms')
    .find({ room: room })
    .toArray()
    .then((data) => {
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    })
});

app.get('/login', (req, res) => {
  const db = getDB();

  db.collection('rooms')
    .find({})
    .toArray()
    .then((data) => {
      let result = data.map(room => room.room);
      let unique = [...new Set(result)];
      res.send(unique);
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    })
});

app.post('/login/new_room', (req, res) => {
  const db = getDB();
  const data = req.body;

  // if (validate(data) === false) return res.status(400).end();

  db.collection('rooms')
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId;
      console.log(data)
      res.status(201).send(data);
    })
    .catch(err => {
      console.log(err);
      res.send(500).end();
    })
})

app.post('/message', (req, res) => {
  const db = getDB();
  const data = req.body;

  // if (validate(data) === false) return res.status(400).end();

  db.collection('rooms')
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId;
      res.status(201).send(data);
    })
    .catch(err => {
      console.log(err);
      res.send(500).end();
    })
});

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