import '../App.css';
import { WrapperData } from '../Wrapper';
import React, { useState } from 'react';
import axios from 'axios';

function CreateRoomForm() {

  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);
  const [createRoomErrorMessage, setCreateRoomErrorMessage] = useState("");

  const { room, setRoom, socket, setIsInRoom, login, connectedUsers } = WrapperData();

  const handleCheckboxClick = () => {
      setIsRoomPrivate(!isRoomPrivate);
      setRoomPassword("");
  }

  const createRoom = () => {
    if(roomName !== "") {
      axios.post("http://localhost:3001/createRoom", {
      login: login,
      socketId: socket.id,
      roomName: roomName,
      roomPassword: roomPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          setRoom(roomName);
          setIsInRoom(true);
        }
      })
      .catch((error) => {
        switch (error.response.status) {
          case 409: {
              setCreateRoomErrorMessage("Pokój o takiej nazwie już istnieje");
          } break;
          default: {
              console.error('Error:', error);
          }
        }
      });
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
