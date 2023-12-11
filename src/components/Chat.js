import React from 'react';
import { useEffect } from 'react';


function Chat(props) {


  const sendMessage = () => {
    if(props.message !== "") {
      props.socket.emit("send_message", { username: props.username, message: props.message, room: props.room });
      props.setMessage("");
    }
  };

  useEffect(() => {
    props.socket.on("receive_message", (data) => {
      const currentDate = new Date();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();
        if(hours < 10) hours = "0" + hours;
        if(minutes < 10) minutes = "0" + minutes;
        if(seconds < 10) seconds = "0" + seconds;
        const timeStamp = hours + ":" + minutes + ":" + seconds;
      props.setMessageReceived((prevMessages) => 
        [
          ...prevMessages,
          {
            "message": data.message,
            "time": timeStamp,
            "date": currentDate,
            "username": data.username
          }
        ]
      );
    });
    return () => {
        if (props.socket) {
          props.socket.off("receive_message");
        }
      };
  }, [props.socket]);
  
  return (
    <div className='chat'>

      <h1>Czat - pokój {props.room}</h1>

      <div className='chatMessages'>
        
        {props.messageReceived.map((mes) => 
          <p key={mes.date}>{mes.username}: {mes.message} - {mes.time}</p>
        )}

      </div>

      <div className='chatInputWithButton'>

        <input value={props.message} placeholder='Wiadomość...' onChange={(event) => {
          props.setMessage(event.target.value);
        }}
        />
        <br/>
        <button onClick={sendMessage}>Wyślij</button>

      </div>

    </div>
  )
}

export default Chat