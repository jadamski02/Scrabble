import React from 'react';
import { useState, useEffect } from 'react';
import { WrapperData } from '../Wrapper';

function Chat() {

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);

  const { setIsInRoom, room, socket, login, numberOfTilesLeft, connectedUsers} = WrapperData();

  const sendMessage = () => {
    if(message !== "") {
      socket.emit("send_message", { login: login, message: message, room: room });
      setMessage("");
    }
  };

  const handleRoomQuit = () => {
    setIsInRoom(false);
    socket.emit("leave_room", room);
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
      const currentDate = new Date();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();
        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;
        const timeStamp = hours + ":" + minutes + ":" + seconds;
      setMessageReceived((prevMessages) => 
        [
          ...prevMessages,
          {
            "message": data.message,
            "time": timeStamp,
            "date": currentDate,
            "login": data.login
          }
        ]
      );
    });
    return () => {
        if (socket) {
          socket.off("receive_message");
        }
      };
  }, [socket]);

  let odmianaPozostalo = "Pozostało"
  let odmianaPlytek = "płytek";
  const liczba = numberOfTilesLeft
  if(liczba % 10 === 2 || liczba % 10 === 3 || liczba % 10 === 4) {
    odmianaPozostalo = "Pozostały"
    odmianaPlytek = "płytki";
  }
  if(liczba == 1) {
    odmianaPozostalo = "Pozostała";
    odmianaPlytek = "Płytka";
  } 
  
  return (
    <div className='chat'>

    <h1>Czat - pokój {room}</h1>

      <div className='chatQuitBtn'>
        <button onClick={handleRoomQuit}>Opuść pokój</button>
      </div>

      <div className="userList">
      <h4>Użytkownicy</h4>
        <ul>
          {connectedUsers.map((user) => (
              <li key={user.socketId}>{user.login}</li>
          ))}
        </ul>
      </div>

      <h3>{odmianaPozostalo} <span style={{color: "orange"}}>{liczba}</span> {odmianaPlytek}</h3>

      <div className='chatMessages'>
      {messageReceived && messageReceived.map((mes) =>
        <p key={mes.date}>{mes.login}: {mes.message} - {mes.time}</p>
      )}
    </div>

      <div className='chatInputWithButton'>

        <input value={message} placeholder='Wiadomość...' onChange={(event) => {
          setMessage(event.target.value);
        }}
        />
        <br/>
        <button onClick={sendMessage}>Wyślij</button>

      </div>

    </div>
  )
}

export default Chat