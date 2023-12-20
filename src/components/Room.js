import React from 'react';
import { WrapperData } from '../Wrapper';

function Room(props) {

  const { setIsInRoom, socket, login, setRoom } = WrapperData();

  const joinExistingRoom = () => {
      socket.emit("join_room",  { login: login, room: props.room.roomName});
      setRoom(props.room.roomName)
      setIsInRoom(true);
  }

  return (
    <div className='room'>

      <p>Pokój: {props.room.roomName}</p>
      <p>Liczba graczy: {props.room.userCount}</p>
      <p><button onClick={joinExistingRoom}>Dołącz</button></p>

    </div>
  )
}

export default Room