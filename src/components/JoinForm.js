import '../App.css';
import { WrapperData } from '../Wrapper';
import React, { useState } from 'react';

function JoinForm() {

  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);

  const { room, setRoom, socket, setIsInRoom, login, connectedUsers } = WrapperData();

  const handleCheckboxClick = () => {
      setIsRoomPrivate(!isRoomPrivate);
      setRoomPassword("");
  }

  const joinRoom = () => {
    if(room === "") {
      console.log(roomName);
      console.log(login)
      socket.emit("join_room",  { login: login, room: roomName });
      setRoom(roomName);
      setIsInRoom(true);
      console.log(connectedUsers);
    }
  }; 
  return (
    <div className="joinForm">

      <h3>Utwórz nowy pokój</h3>

      <div className='joinFormBox'>
      <input 
      value={roomName} 
      placeholder='Nazwa pokoju...' 
      onChange={(event) => {
        setRoomName(event.target.value);
      }}
      />
      </div>

      <div className='joinFormBox'>
        <label htmlFor="privateCheck">Pokój prywatny?</label>
        <input 
        id="privateCheck" 
        type="checkbox" 
        value={isRoomPrivate} 
        onChange={handleCheckboxClick} /> 
      </div>

      <div className='joinFormBox'>
        <input 
        type="password"
        value={roomPassword} 
        disabled={!isRoomPrivate} 
        placeholder='Hasło do pokoju...' 
        onChange={(event) => {
          setRoomPassword(event.target.value);
        }}
        />
      </div>

      <div className='joinFormBox'>
        <button onClick={joinRoom}>Utwórz</button>
      </div>

      <br/>
    
    </div>
  );
}

export default JoinForm;
