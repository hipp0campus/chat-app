const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { getDB } = require('./db');
const validate = require('./utils/validate');
const formatMessage = require('./utils/formatMessage');
const { 
  userJoin,
  getCurrentUser, 
  userLeave, 
  getRoomUsers
} = require('./utils/users');

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

  if (validate(data) === false) return res.status(400).end();

  // Validate duplicate rooms.
  db.collection('rooms')
    .find({room: data.room})
    .toArray()
    .then(data => {
      if (data.length) return res.status(400).send(`Will not handle duplicate room names.`);
    })
    .catch(err => {
      console.log(err)
    });

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
})

app.delete('/login/delete_room', (req, res) => {
  const db = getDB();
  const data = req.body.room;

  db.collection('rooms')
    .deleteMany({ room: data })
    .then(() => {
      res.status(204).send(data);
    })
    .catch(err => {
      console.log('Error', err);
      res.send(500).end();
    })
});

app.post('/message', (req, res) => {
  const db = getDB();
  const data = req.body;

  if (validate(data) === false) return res.status(400).end();

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
    
    socket.on('new_message', (msg) => {
      const user = getCurrentUser(socket.id);
      
      socket.broadcast.to(user.room).emit('new_message', formatMessage(user.username, msg));
    });
    
    io.to(user.room).emit('room_users', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  })

  socket.on('leave_room', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('room_users', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    };
  });

  socket.on('update_room', (rooms) => {
    let uniqueRooms = [...new Set(rooms)];
    socket.broadcast.emit('update_room', uniqueRooms);
  })
  
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('room_users', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    };
  });
});

const PORT = process.env.PORT || 8080;

http.listen(PORT, () => console.log(`Listening on port ${PORT}...`));