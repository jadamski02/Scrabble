import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';

import LoggedIn from './components/LoggedIn';
import Login from './components/Login';
import { SignUp } from './components/SignUp';

const WrapperContext = createContext();
export const WrapperData = () => useContext(WrapperContext);
const socket = io.connect("http://localhost:3001");

export const Wrapper = () => {

    const [tilesOnRack, setTilesOnRack] = useState([
        {id: 0, tile: { id: "", letter: "", value: ""}},
        {id: 1, tile: { id: "", letter: "", value: ""}},
        {id: 2, tile: { id: "", letter: "", value: ""}},
        {id: 3, tile: { id: "", letter: "", value: ""}},
        {id: 4, tile: { id: "", letter: "", value: ""}},
        {id: 5, tile: { id: "", letter: "", value: ""}},
        {id: 6, tile: { id: "", letter: "", value: ""}}
    ]);
    const cookies = new Cookies();
    const [isInRoom, setIsInRoom] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [login, setLogin] = useState(cookies.get("login"));
    const [email, setEmail] = useState(cookies.get("email"));
    const [token, setToken] = useState(cookies.get("token"));
    const [room, setRoom] = useState("");
    const [numberOfLettersToGet, setNumberOfLettersToGet] = useState(7);
    const [numberOfTilesLeft, setNumberOfTilesLeft] = useState(100);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [ loginMessage, setLoginMessage ] = useState(null);

    useEffect(() => {
        checkLoginStatus();
        getAvailableRooms();

        socket.on("set_number_of_tiles_left", (data) => {
            setNumberOfTilesLeft(data.numberOfTilesLeft);
        });

        socket.on("updated_users_list", (users) => {
            setConnectedUsers(users);
        });

        socket.on("updated_rooms_list", (updatedRoomsList) => {
            const roomsWithUsers = updatedRoomsList;
    
            const roomsList = Object.keys(roomsWithUsers);
            const formattedRooms = roomsList.map(room => {
                return {
                    roomName: room,
                    userCount: roomsWithUsers[room].length 
                };
            });
    
            setAvailableRooms(formattedRooms);

        });

        socket.on("user_disconnected", (data) => {
            setConnectedUsers((prevUsers) =>
                prevUsers.filter((username) => username !== data.username)
            );
        });

        return () => {
            socket.off("updated_users_list");
        };
    }, []);

    const doLogin = async (login, password) => {
        setLoginMessage('');
      if(login.length === 0) setLoginMessage("Proszę podać poprawny login");
      if(login.length === 0) setLoginMessage("Proszę podać poprawne hasło");
      axios.post("http://localhost:3001/login", {
        login,
        password,
      })
      .then((res) => {
        if(res.status === 200) {
          const { login, email, token, role_id } = res.data;
          cookies.set("login", login);
          cookies.set("email", email);
          cookies.set("token", token);
          setLogin(login);
          setEmail(email);
          setToken(token);
          setIsAuth(true);
        }
      })
      .catch((error) => {
        switch (error.response.status) {
            case 401: {
                console.error('Niepoprawne dane - 401');
                setLoginMessage("Niepoprawne dane");
            } break;
            case 403: {
                console.error('Brak dostępu - 403');
                setLoginMessage("Użytkownik zablokowany");
            } break;
            case 404: {
                console.error('Użytkownik nie został znaleziony - 404');
                setLoginMessage("Użytkownik nie został znaleziony");
            } break;
            default: {
                console.error('Error:', error);
            }
        }
      });
        
    }

    const checkLoginStatus = async () => {
        const token = cookies.get("token")
        if(token === undefined) return;

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: cookies.get("token") })
      };
    
        axios.post("http://localhost:3001/checkLoginStatus", {
        token: token
        })
        .then((res) => {
            if(res.status === 200) {
            const { login, email, token, role_id, } = res.data;
            cookies.set("token", token);
            setToken(token);
            setIsAuth(true);
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 403) {
                cookies.remove("login");
                cookies.remove("email");
                cookies.remove("token");
            } else if(error.response && error.response.status === 401){
                console.error('Niepoprawne dane - 401');
            } else {
                console.error('Error:', error);
            }
        });
    
      }

    const doSignUp = async (login, email, password) => {
        try {
            const response = await axios.post("http://localhost:3001/signUp", {
                login,
                email,
                password
            });
    
            if (response.status === 200) {
                const { login, email, token, role_id } = response.data;
                cookies.set("login", login);
                cookies.set("email", email);
                cookies.set("token", token);
                setLogin(login);
                setEmail(email);
                setToken(token);
                setIsAuth(true);
            } else {
                console.log("Unexpected status code:", response.status);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    

    const getTiles = async () => {
        if (numberOfLettersToGet > 0) {
            try {
                const response = await axios.get(`http://localhost:3001/letters/${room}/${numberOfLettersToGet}`);
                const newTiles = response.data;

                const updatedTiles = tilesOnRack.map((singlePlace) => {
                    if(singlePlace.tile.value === "") return {
                        id: singlePlace.id,
                        tile: newTiles.shift()
                    }
                    return singlePlace;
                });
    
                setTilesOnRack(updatedTiles);
                setNumberOfLettersToGet(0);
                socket.emit("set_number_of_tiles_left", { room: room });
            } catch (err) {
                console.log(err);
            }
        }
    };

    const getAvailableRooms = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/rooms`);
            const roomsWithUsers = response.data;
    
            const roomsList = Object.keys(roomsWithUsers);
            const formattedRooms = roomsList.map(room => {
                return {
                    roomName: room,
                    userCount: roomsWithUsers[room].length 
                };
            });
    
            setAvailableRooms(formattedRooms);
        } catch (error) {
            console.error(error);
        }
    };
    

    const removeTileFromRack = (event, placeId) => {

        if (event?.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        }
  
        const newRack = tilesOnRack.map((placeForTile) => {
          if(placeForTile.id == placeId) {
            return {...placeForTile, tile: { id: "", letter: "", value: ""}}
          } else {
            return placeForTile;
          }
  
        });
        setTilesOnRack(newRack);
        setNumberOfLettersToGet(numberOfLettersToGet + 1);
      };

      const shuffleTiles = () => {
        const newArr = [...tilesOnRack];
        setTilesOnRack(newArr.sort(() => Math.random() - 0.5));
      };

      const handleLogOut = () => {
        setIsAuth(false);
        cookies.remove("token");
        cookies.remove("login");
        cookies.remove("email");
      }

    return (

        <WrapperContext.Provider value={{ loginMessage, setLoginMessage, handleLogOut, doLogin, doSignUp, connectedUsers, availableRooms, room, socket, shuffleTiles, getTiles, tilesOnRack, numberOfTilesLeft, setTilesOnRack, removeTileFromRack, setRoom, isInRoom, setIsInRoom, login, setLogin, isAuth }}>
            <>
            <div className='app-container'>
      
                {isAuth ? 
                    <LoggedIn />
                    :
                    <>
                    <Login />
                    <SignUp />
                    </>

                }

            </div>
            </>
        </WrapperContext.Provider>

    )
}