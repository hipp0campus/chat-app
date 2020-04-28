import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { uuid } from 'uuidv4';

const Container = styled.footer`
  .form-control {
    display: flex;
    padding: 12px;

    input[type="text"] {
      flex: 1;
      padding: 6px;
    }
  }
`;

export default function MainFooter({ socket, currentUser, room, handleClientMessages }) {
  const [message, setMessage] = useState('');

  function onChange(e) {
    setMessage(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();

    axios.post('/message', {
      room,
      user: currentUser,
      message,
    });

    socket.emit('new_message', message);

    setMessage('');

    handleClientMessages({
      _id: uuid(),
      room,
      user: currentUser,
      message,
    });
  }

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <input
           type="text" 
           onChange={onChange} 
           name="message"
           value={message}
          />
          <input type="submit" value="Send"/>
        </div>
      </form>
    </Container>
  )
}
