import React from 'react';
import styled from 'styled-components';

const Container = styled.aside`
  width: 200px;
  height: 500px;
  border-top: 2px solid black;
  border-bottom: 2px solid black;

  overflow-y: auto;

  .current-room {
    padding: 12px;
    cursor: default;
  }

  .current-room p:last-child {
    padding-top: 6px;
    text-decoration: underline;
  }

  p {
    font-weight: 600;
  }

  .users {
    padding: 0px 12px;
    cursor: default;
  }

  #users {
    padding-top: 24px;
    padding-bottom: 6px;
    padding-left: 12px;
  }

  .user-container {
    p {
      padding: 2px 0px;
    }
  }
`;

export default function MainAside({ users, room }) {
  return (
    <Container>
      <div className="current-room">
        <p>Room Name:</p>
        <p>{room}</p>
      </div>
      <p id="users">Users:</p>
      <div className="users">
        {users.map(user => {
          return (
            <span key={user.id} className="user-container">
              <p>{user.username}</p>
            </span>
          )
        })}
      </div>
    </Container>
  )
}
