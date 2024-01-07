import React, { useState } from 'react';
import axios from 'axios';
import { WrapperData } from '../Wrapper';

function Room(props) {
  const { setIsInRoom, socket, login, setRoom } = WrapperData();

  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const joinExistingRoom = () => {
    if (props.room.isPrivate) {
      setIsPasswordPromptVisible(true);
    } else {
      joinRoom();
    }
  };

  const handlePasswordSubmit = () => {
    joinRoom();
  };

  const joinRoom = () => {
    setErrorMessage('');
    axios.post("http://localhost:3001/joinRoom", {
      login: login,
      socketId: socket.id,
      roomName: props.room.roomName,
      roomPassword: roomPassword,
    })
    .then((res) => {
      if (res.status === 200) {
        setRoom(props.room.roomName);
        setIsInRoom(true);
      }
    })
    .catch((error) => {
      setRoomPassword('');
      switch (error.response.status) {
        case 403: {
            console.error('Niepoprawne hasło', error);
            setErrorMessage("Niepoprawne hasło");
        } break;
        default: {
            console.error('Error:', error);
        }
    }
    });
  };

  return (
    <div className='room'>
      <div className='roomBox'>Pokój: {props.room.roomName}</div>
      <div className='roomBox'>Liczba graczy: {props.room.userCount}</div>
      <div className='roomBox'>
        <button onClick={joinExistingRoom}>Dołącz</button>
        {props.room.isPrivate ? (
          <img src='lock_closed.png' alt='Locked' />
        ) : (
          <img src='lock_open.png' alt='Unlocked' />
        )}
      </div>

      {isPasswordPromptVisible && (
        <div className='password-prompt'>
          <input
            type='password'
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
            placeholder='Wprowadź hasło do pokoju'
          />
          <br/>
          <button onClick={handlePasswordSubmit}>Potwierdź</button>
          <br/>
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Room;
