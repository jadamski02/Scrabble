import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import JoinForm from './components/JoinForm';
import Chat from './components/Chat';
import io from 'socket.io-client';
import GameArea from './components/GameArea';

const WrapperContext = createContext();
export const WrapperData = () => useContext(WrapperContext);
const socket = io.connect("http://localhost:3001");

export const Wrapper = () => {


    const [tilesOnRack, setTilesOnRack] = useState([
        {id: -100, letter: "", value: null},
        {id: -101, letter: "", value: null},
        {id: -102, letter: "", value: null},
        {id: -103, letter: "", value: null},
        {id: -104, letter: "", value: null},
        {id: -105, letter: "", value: null},
        {id: -106, letter: "", value: null}
    ]);
    const [isInRoom, setIsInRoom] = useState(false);
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messageReceived, setMessageReceived] = useState([]);
    const [numberOfLetters, setNumberOfLetters] = useState(7);

    const getTiles = async () => {
        if(numberOfLetters > 0) {
            await axios.get(`http://localhost:3001/letters/${numberOfLetters}`)
            .then((response) => {
                setTilesOnRack(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }

    };

    const updateRack = (event, id) => {

        if (event?.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        }
  
        const newRack = tilesOnRack.map((singleTile) => {
          if(singleTile.id == id) {
            return {...singleTile, letter: "", value: null}
          } else {
            return singleTile;
          }
  
        });
  
        setTilesOnRack(newRack);

      }

    useEffect(() => {
        // setNumberOfLetters(7 - tilesOnRack.length)
    }, [tilesOnRack])

    return (

        <WrapperContext.Provider value={{ getTiles, tilesOnRack, setTilesOnRack, updateRack }}>
            <>
            <div className='app-container'>
      
                {isInRoom ?
                <>
                    <GameArea />
                    <div  className='chat-area'>
                    <Chat
                        socket={socket}
                        username={username}
                        room={room}
                        message={message}
                        messageReceived={messageReceived}
                        setMessage={setMessage}
                        setMessageReceived={setMessageReceived} />
                    </div>
                </>
                
                :
                
                <JoinForm 
                socket={socket} 
                username={username} 
                room={room} 
                setUsername={setUsername} 
                setRoom={setRoom} 
                setIsInRoom={setIsInRoom}/>
                }
                
            </div>
            </>
        </WrapperContext.Provider>

    )
}