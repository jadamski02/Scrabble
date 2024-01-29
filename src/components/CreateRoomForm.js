import '../App.css';
import { WrapperData } from '../Wrapper';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateRoomForm() {

  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);
  const [createRoomErrorMessage, setCreateRoomErrorMessage] = useState("");

  const { room, setRoom, socket, isInRoom, setIsInRoom, login, connectedUsers } = WrapperData();

  const handleCheckboxClick = () => {
      setIsRoomPrivate(!isRoomPrivate);
      setRoomPassword("");
  }

  const createRoom = async () => {
    if (roomName !== "") {
      try {
        const response = await axios.post("http://localhost:3001/scrabble/createRoom", {
          login: login,
          socketId: socket.id,
          roomName: roomName,
          roomPassword: roomPassword,
        });
  
        if (response.status === 200) {
          setRoom(roomName);
          setIsInRoom(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setCreateRoomErrorMessage("Pokój o takiej nazwie już istnieje");
        } else {
          console.error('Error:', error);
        }
      }
    }
  };
  

  return (
    <div className="createRoomForm">

      <h3>Utwórz nowy pokój</h3>

      <div className='createRoomFormBox'>
      <input 
      value={roomName} 
      placeholder='Nazwa pokoju...' 
      onChange={(event) => {
        setRoomName(event.target.value);
        setCreateRoomErrorMessage("");
      }}
      />
      </div>

      <div className='createRoomFormBox'>
        <label htmlFor="privateCheck">Pokój prywatny?</label>
        <input 
        id="privateCheck" 
        type="checkbox" 
        value={isRoomPrivate} 
        onChange={handleCheckboxClick} /> 
      </div>

      <div className='createRoomFormBox'>
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

      <div className='createRoomFormBox'>
        <button onClick={createRoom}>Utwórz</button>
      </div>

      {createRoomErrorMessage}

      <br/>
    
    </div>
  );
}

export default CreateRoomForm;
