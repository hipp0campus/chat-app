import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  text-align: center;

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
    input {
      flex: 6;
    }

    button {
      flex: 1;
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
`;

export default function Login() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState([]);

  useEffect(() => {
    if (!rooms.length) {
      axios.get('/login')
      .then(data => data.data)
      .then(rooms => setRooms(rooms));
    }
  }, [rooms]);

  function handleNewRoom() {
    axios.post('/login/new_room', {
      room: roomName,
      message: 'Welcome to your new chatroom!',
      user: 'Chat-Bot'
    });

    setRoomName('');
  }

  function onChange(e) {
    setRoomName(e.target.value);
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
                required
              />
            </div>
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
                <button onClick={handleNewRoom}>Add room</button>
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="room">Room</label>
              <div className="room-control">
                <select name="room" id="room">
                  {rooms.map((room, i) => <option key={i} value={room}>{room}</option>)}
                </select>
                <button>Delete room</button>
              </div>
            </div>
            <div className="form-control">
              <input type="submit" className="btn" value="Join Chat" />
            </div>
          </form>
        </main>
      </div>
    </Container>
  )
}