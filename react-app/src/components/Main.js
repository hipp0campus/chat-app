import React, { useEffect, useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import io from 'socket.io-client';
import qs from 'qs';
import axios from 'axios';

import MainHeader from './MainHeader';
import MainMain from './MainMain';
import MainAside from './MainAside';
import MainFooter from './MainFooter';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .wrapper {
    border: 2px solid black;
    border-radius: 6px;
  }

  .flex-container {
    display: flex;
  }
`;

export default function Main() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState('');
  const [currentUser, setCurrentUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const socket = io('localhost:8080');
    setSocket(socket);

    const { username, room } = qs.parse(search, { ignoreQueryPrefix: true });
    socket.emit('join_room', { username, room });

    setCurrentUser(username);
    setRoom(room);

    socket.on('room_users', ({ users }) => {
      setUsers(users);
    });

    return () => {
      socket.off('room_users');
    }

  },[search]);

  function handleClientMessages(clientMsg) {
    const newMessages = [...messages];

    newMessages.push(clientMsg);
    setMessages(newMessages);
  }

  return (
    <Container>
      {search ? null : <Redirect to="/login" />}
      <div className="wrapper">
        <MainHeader />
        <div className="flex-container">
          <MainAside users={users} room={room} />
          <MainMain socket={socket} messages={messages} room={room} />
        </div>
        <MainFooter socket={socket} currentUser={currentUser} room={room} handleClientMessages={handleClientMessages}/>
      </div>
    </Container>
  )
}