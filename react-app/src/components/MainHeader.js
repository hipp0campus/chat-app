import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.header`
  display: flex;
  justify-content: space-between;

  h1 {
    font-size: 38px;
    font-weight: 600;

    margin: 12px;
  }

  button {
    align-self: center;
    padding: 6px;
    margin: 12px;
  }
`;

export default function MainHeader({ socket }) {
  function onClick() {
    socket.emit('leave_room');
  }

  return (
    <Container>
      <h1>Chat-App</h1>
      <Link to="/login">
        <button onClick={onClick}>Leave Room</button>
      </Link>
    </Container>
  )
}
