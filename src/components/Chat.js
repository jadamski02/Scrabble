import React from 'react';
import { useState, useEffect } from 'react';
import { WrapperData } from '../Wrapper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import UserMessage from './UserMessage';
import SystemInfo from './SystemInfo';

function Chat() {

  const { movesList, room, socket, login } = WrapperData();
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);

  const sendMessage = () => {
    if(message !== "") {
      socket.emit("send_message", { login: login, message: message, room: room, type: "userMessage" });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
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
            "login": data.login,
            "type": data.type
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
    
      <Tabs>
    <TabList>
      <Tab>Czat</Tab>
      <Tab>Wyrazy</Tab>
    </TabList>

    <TabPanel>
    <div className='chat'>

      <div className='chatMessages'>
        {messageReceived ?
        (
          messageReceived.map((mes, index) => {
            {if(mes.type !== "userMessage") return <SystemInfo key={index} mes={mes} />}
            {if(mes.type === "userMessage") {return <UserMessage key={index} mes={mes} />}
             } }
        )
        )
        :
        null
        }
      </div>

      <div className='chatInputWithButton'>

        <input value={message} placeholder='Wiadomość...' onChange={(event) => {
          setMessage(event.target.value);
        }}
        />
        <button onClick={sendMessage}>Wyślij</button>

      </div>
      </div>
    </TabPanel>
    <TabPanel>
      <div className='movesList'>
      {movesList.map((ml) => (
        <div className='movesListElement' key={ml.turn_id}>
          <ul>
            {ml.words.map((w, index) => (
              <li key={index}>
                {w.word === "bonus" ? (
                  <span style={{ color: "red" }}> {w.word}</span>
                ) : (
                  <span>{w.word}</span>
                )}
                <span style={{ color: "#ff8503" }}> {w.points}</span>
              </li>
            ))}
          </ul>
      </div>
))}

      </div>
      </TabPanel>
  </Tabs>


  )
}

export default Chat