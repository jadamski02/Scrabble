import React from 'react';
import { useState, useEffect } from 'react';
import { WrapperData } from '../Wrapper';

function Chat() {

  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);

  const { room, socket, login } = WrapperData();

  const sendMessage = () => {
    if(message !== "") {
      socket.emit("send_message", { login: login, message: message, room: room });
      setMessage("");
    }
  };



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

  return (
    <div className='chat'>

    <h2>Czat</h2>

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
        <button onClick={sendMessage}>Wyślij</button>

      </div>

    </div>
  )
}

export default Chat