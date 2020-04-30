import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import io from 'socket.io-client';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  text-align: center;

  form {
    border-bottom: 2px solid black;
    margin-bottom: 12px;
    padding-bottom: 12px;
  }

  .wrapper {
    min-height: 300px;
    min-width: 400px;

    border: 2px solid black;
    border-radius: 6px;
  }

  header {
    text-align: center;
    border-bottom: 2px solid black;

    h1 {
      font-size: 38px;
      font-weight: 600;
      padding: 12px 0px;
    }
  }

  .form-control {
    display: flex;
    flex-direction: column;
    padding: 14px;
    font-size: 16px;
    
    label {
      align-self: flex-start;
    }
  }

  .room-control {
    display: flex;
    
    select,
    input[type="text"] {
      flex: 6;
    }

    input[type="submit"] {
      flex: 2;
      cursor: pointer;
    }
  }

  select,
  input[type="text"] {
    font-family: 'Baloo Paaji 2', cursive;
    font-weight: 600;
    font-size: 16px;

    padding: 6px 12px;
  }

  .btn {
    padding: 6px;
    cursor: pointer;
    font-family: 'Baloo Paaji 2', cursive;
    font-size: 16px;
  }

  #validation {
    font-size: 12px;
    margin-top: 6px;
  }

  #delete-room {
    margin-top: 6px;
    flex: 1;
    padding: 12px;
  }
`;

export default function Login() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('localhost:8080');
    setSocket(socket);

    socket.on('update_room', newRooms => {
      setRooms(newRooms);
    });

    return () => {
      socket.off('update_room');
    }
  }, [rooms]);

  useEffect(() => {
    if (!rooms.length) {
      axios.get('/login')
      .then(data => data.data)
      .then(rooms => setRooms(rooms));
    }
  }, [rooms]);

  function handleNewRoom() {
    const isValid = validateInput(roomName);

    if (isValid) {
      axios.post('/login/new_room', {
        room: roomName,
        message: 'Welcome to your new chatroom!',
        user: 'Chat-Bot'
      });

      
      const copyRooms = [...rooms];
      copyRooms.push(roomName);
      setRooms(copyRooms);

      socket.emit('update_room', (copyRooms));
    };

    setRoomName('');
  }

  function validateInput(input) {
    let onlyLetters = /^[A-Z]{1,12}$/i;

    if (onlyLetters.test(input)) {
      let isDuplicate = rooms.find(room => input === room);
      if (!isDuplicate) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function handleDeleteRoom() {
    axios.delete('/login/delete_room', {
      data: { room: selectVal }
    })
    .catch(err => {
      console.log(err);
    });
    
    const copyRooms = [...rooms];
    
    const roomIndex = copyRooms.findIndex(room => room === selectVal);
    copyRooms.splice(roomIndex, 1);

    setRooms(copyRooms);

    socket.emit('update_room', (copyRooms));
  }

  function onChange(e) {
    setRoomName(e.target.value);
  }

  function handleSelect(e) {
    setSelectVal(e.target.value);
  }

  return (
    <Container>
      <div className="wrapper">
        <header>
          <h1>Chat-App</h1>
        </header>
        <main>
          <form action="/chatroom">
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input 
                type="text"
                name="username"
                id="username"
                placeholder="Enter username..."
                minLength="3"
                maxLength="20"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="room">Room</label>
              <div className="room-control">
                <select name="room" id="room" value={selectVal} onChange={handleSelect}>
                  {rooms.map((room, i) => <option key={i} value={room}>{room}</option>)}
                </select>
              </div>
            </div>
            <div className="form-control">
              <input type="submit" className="btn" value="Join Chat" />
            </div>
          </form>
          <div className="form-control">
              <label htmlFor="add-room">Room name</label>
              <div className="room-control">
                <input 
                  onChange={onChange}
                  value={roomName}
                  type="text"
                  name="Room name"
                  id="add-room"
                  placeholder="Add new room..."
                />
                <input type="submit" onClick={handleNewRoom} value="Add room" />
              </div>
              <p id="validation">
                Can only contain letters and must be between 1-12 characters.<br/>
                Cannot make a duplicate room.
                </p>
                <input id="delete-room" type="submit" onClick={handleDeleteRoom} value="Delete selected room" />
            </div>
        </main>
      </div>
    </Container>
  )
}