import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';
import { doubleLetterScores, doubleWordScores, tripleLetterScores, tripleWordScores } from './components/ExtraPoints';

import LoggedIn from './components/LoggedIn';
import Login from './components/Login';
import { SignUp } from './components/SignUp';

const WrapperContext = createContext();
export const WrapperData = () => useContext(WrapperContext);
const socket = io.connect("http://localhost:3001");

export const Wrapper = () => {

    const [tilesOnRack, setTilesOnRack] = useState([
        { id: 0, tile: { id: "", letter: "", value: "" } },
        { id: 1, tile: { id: "", letter: "", value: "" } },
        { id: 2, tile: { id: "", letter: "", value: "" } },
        { id: 3, tile: { id: "", letter: "", value: "" } },
        { id: 4, tile: { id: "", letter: "", value: "" } },
        { id: 5, tile: { id: "", letter: "", value: "" } },
        { id: 6, tile: { id: "", letter: "", value: "" } }
    ]);
    const [board, setBoard] = useState([]);
    const cookies = useMemo(() => new Cookies(), []);
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
    const [loginMessage, setLoginMessage] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [whoseTurn, setWhoseTurn] = useState(null);
    const [turnCount, setTurnCount] = useState(0);
    const [turnLetters, setTurnLetters] = useState([]); /// kafelki wylozone w danej turze
    const [turnPoints, setTurnPoints] = useState(0);    /// suma punktow w jednej turze (nowe kafelki oraz kafelki wylozone wczesniej)
    const [gamePoints, setGamePoints] = useState(0);    /// suma wszystkich zdobytych punktow
    const Ref = useRef(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [hostUser, setHostUser] = useState(0);
    const [words, setWords] = useState([]); /// slowa utworzone w danej turze
    const [movesList, setMovesList] = useState([]);
    const [movePossible, setMovePossible] = useState(false);
    const [wordLetters, setWordsLetters] = useState([]);
    const [timer, setTimer] = useState(300);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        console.table(turnLetters);
    }, [turnLetters]);

    axios.defaults.withCredentials = true;

    useEffect(() => {

        const checkLoginStatus = async () => {
            const token = cookies.get("token");
            if (token === undefined) return;
        
            try {
                const response = await axios.post(
                    "http://localhost:3001/auth/checkLoginStatus",
                    { token: token },
                    { withCredentials: true }
                );
        
                if (response.status === 200) {
                    const { token } = response.data;
                    cookies.set("token", token);
                    setToken(token);
                    setIsAuth(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    cookies.remove("login");
                    cookies.remove("email");
                    cookies.remove("token");
                } else if (error.response && error.response.status === 401) {
                    console.error('Niepoprawne dane - 401');
                } else {
                    console.error('Error:', error);
                }
            }
        };
        
        const getAvailableRooms = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/scrabble/rooms",
                    { withCredentials: true }
                );
        
                const roomsWithUsers = response.data;
                const formattedRooms = formatRooms(roomsWithUsers);
                setAvailableRooms(formattedRooms);
            } catch (error) {
                console.error(error);
            }
        };
        
        const fetchData = async () => {
            await checkLoginStatus();
            await getAvailableRooms();
        };

        fetchData();

        const numberOfTilesLeftListener = (data) => {
            setNumberOfTilesLeft(data.numberOfTilesLeft);
        };

        const gameStartedListener = (data) => {
            getTiles(data.room);
            setIsGameStarted(true);
            setWhoseTurn(data.randomUser.login);
            startTimer();
            if (data.randomUser.socketId === socket.id) {
                setIsMyTurn(true);
            } else {
                setIsMyTurn(false);
            }
        };
        

        const updatedUsersListListener = (users) => {
            setConnectedUsers(users);
        };

        const updatedRoomsListListener = (updatedRoomsList) => {
            const roomsWithUsers = updatedRoomsList;
            const formattedRooms = formatRooms(roomsWithUsers);
            setAvailableRooms(formattedRooms);
        };

        const userDisconnectedListener = (data) => {
            setConnectedUsers((prevUsers) =>
                prevUsers.filter((username) => username !== data.username)
            );
        };

        const organizeWordsByTurnCount = (wordsArray) => {
            const result = [];
            wordsArray.forEach((word) => {
              if (!result[word.turnCount]) {
                result[word.turnCount] = { turn_id: word.turnCount, words: [] };
              }
              result[word.turnCount].words.push({ word: word.word, points: word.points });
            });
            return result.filter(Boolean);
          };

        const updateGameStatsListener = (data) => {
            if (data.newUserTurn && data.newUserTurn.socketId && data.newUserTurn.socketId === socket.id) {
                setIsMyTurn(true);
            } else {
                setIsMyTurn(false);
            }
            if (data.newUserTurn) {
                setWhoseTurn(data.newUserTurn.login);
            }
            setTurnCount(data.turnCount);
            if(data.words.length > 0) setMovesList(organizeWordsByTurnCount(data.words));
        };

        const setHostUserListener = (data) => {
            setHostUser(data);
        };

        const resetTimerListener = () => {
            resetTimer();
        };

        const gameEndedListener = (data) => {
            setWinner(data.winner);
            setGameEnded(true);
            setIsTimerActive(false);
            setIsMyTurn(false);
        }

        socket.on("set_number_of_tiles_left", numberOfTilesLeftListener);
        socket.on("updated_users_list", updatedUsersListListener);
        socket.on("updated_rooms_list", updatedRoomsListListener);
        socket.on("user_disconnected", userDisconnectedListener);
        socket.on("update_game_stats", updateGameStatsListener);
        socket.on("set_host_user", setHostUserListener);
        socket.on("game_started", gameStartedListener);
        socket.on("reset_timer", resetTimerListener);
        socket.on("game_ended", gameEndedListener);

        return () => {
            socket.off("updated_users_list", updatedUsersListListener);
            socket.off('game_started', gameStartedListener);
        };
    }, [cookies]);

    const doLogin = async (login, password) => {
        setLoginMessage('');
        if (login.length === 0) setLoginMessage("Proszę podać poprawny login");
        if (login.length === 0) setLoginMessage("Proszę podać poprawne hasło");
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                login,
                password,
            });
            
            if (response.status === 200) {
                const { login, email, token } = response.data;
                cookies.set("login", login);
                cookies.set("email", email);
                cookies.set("token", token);
                setLogin(login);
                setEmail(email);
                setToken(token);
                setIsAuth(true);
            }
        } catch (error) {
            if (error.response && error.response.status) {
                switch (error.response.status) {
                    case 401:
                        console.error('Niepoprawne dane - 401');
                        setLoginMessage("Niepoprawne dane");
                        break;
                    case 403:
                        console.error('Brak dostępu - 403');
                        setLoginMessage("Użytkownik zablokowany");
                        break;
                    case 404:
                        console.error('Użytkownik nie został znaleziony - 404');
                        setLoginMessage("Użytkownik nie został znaleziony");
                        break;
                    default:
                        console.error('Error:', error);
                }
            }
        }
    }

    const doSignUp = async (login, email, password) => {
        try {
            const response = await axios.post("http://localhost:3001/auth/signUp", {
                login,
                email,
                password
            });

            if (response.status === 200) {
                const { login, email, token } = response.data;
                cookies.set("login", login);
                cookies.set("email", email);
                cookies.set("token", token);
                setLogin(login);
                setEmail(email);
                setToken(token);
                setIsAuth(true);
            } else {
                console.log("Niespodziewany błąd: ", response.status);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleLogOut = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/auth/logout`, { refreshToken: token });
            if(response.status === 204) {
                setIsAuth(false);
                cookies.remove("token");
                cookies.remove("login");
                cookies.remove("email");
            }
        } catch (error) {
            console.log("Błąd wylogowania:", error);
        }
        
    };

    const formatRooms = (roomsWithUsers) => {
        const roomsList = Object.keys(roomsWithUsers);
        const formattedRooms = roomsList.map(room => {
            return {
                roomName: room,
                userCount: roomsWithUsers[room].users.length,
                isPrivate: roomsWithUsers[room].isPrivate
            };
        });
        return formattedRooms;
    };

    const getTiles = async (whichRoom) => {
        if (!whichRoom) {
            console.error("Invalid room value:", whichRoom);
            return;
        }
        if(numberOfLettersToGet > numberOfTilesLeft) {
            setNumberOfLettersToGet(numberOfTilesLeft);
        }
        if (numberOfLettersToGet > 0) {

            try {
                const response = await axios.get(`http://localhost:3001/scrabble/letters/${whichRoom}/${numberOfLettersToGet}`);
                const newTiles = response.data;

                const updatedTiles = tilesOnRack.map((singlePlace) => {
                    if (singlePlace.tile.value === "" && newTiles.length > 0) return {
                        id: singlePlace.id,
                        tile: newTiles.shift()
                    }
                    return singlePlace;
                });

                setTilesOnRack(updatedTiles);
                setNumberOfLettersToGet(0);
                await socket.emit("set_number_of_tiles_left", { room: whichRoom });
            } catch (err) {
                console.log(err);
            }
        } 
    };

    // useEffect(() => {
    //     if(numberOfLettersToGet > numberOfTilesLeft) {
    //         setNumberOfLettersToGet(numberOfTilesLeft); 
    //     }
    // }, [numberOfTilesLeft])
    
    const removeTileFromRack = (event, placeId) => {

        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.preventDefault();
        }

        const newRack = tilesOnRack.map((placeForTile) => {
            if (placeForTile.id === placeId) {
                return { ...placeForTile, tile: { id: "", letter: "", value: "" } }
            } else {
                return placeForTile;
            }

        });
        setTilesOnRack(newRack);
        setNumberOfLettersToGet(numberOfLettersToGet + 1);
    };

    const removeTileFromBoard = (event, x, y) => {

        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.preventDefault();
        }

        const newBoard = board.map((cell) => {
            if (cell.row === x && cell.col === y) {
                return { ...cell, letter: '', value: '', tileId: '' }
            } else return cell
        });

        setBoard(newBoard);
        setNumberOfLettersToGet(numberOfLettersToGet - 1);
        socket.emit("update_board", { room: room, board: newBoard });
    }

    const shuffleTiles = () => {
        const newArr = [...tilesOnRack];
        setTilesOnRack(newArr.sort(() => Math.random() - 0.5));
    };

    const wordFromLetters = () => {

        let isHorizontal = true;
        let isVertical = true;
        let horizontalAxis = turnLetters[0].rowIndex;
        let verticalAxis = turnLetters[0].colIndex;
        let word = "";
        let upperTile = null;
        let lowerTile = null;
        let leftTile = null;
        let rightTile = null;
        let wordsCreated = [];
        let newWordsLettersArr = turnLetters.map((tl) => {
            return { rowIndex: tl.rowIndex, colIndex: tl.colIndex, letter: tl.letter, value: tl.computedValue, tileId: tl.tileId }
        });
        // tworzymy zmienna tablicowa do zliczenia punktow calego slowa - poczatkowo same literki z tury biezacej);

        setMovePossible(true);

        // sprawdzamy czy zostal wylozony tylko jeden kafelek
        if (turnLetters.length === 1) {
            console.log("Pojedynczy kafelek");
            // sprawdzamy czy plytka w ogole ma sasiadow
            let horizontalLetters = new Set();
            let horizontalWord = "";
            let verticalLetters = new Set();
            let verticalWord = "";
            const originCoords = { row: horizontalAxis, col: verticalAxis };
            let coords = { row: horizontalAxis, col: verticalAxis };
            upperTile = board.find(el => el.row === coords.row - 1 && el.col === coords.col && el.tileId !== '');
            lowerTile = board.find(el => el.row === coords.row + 1 && el.col === coords.col && el.tileId !== '');
            leftTile = board.find(el => el.row === coords.row && el.col === coords.col - 1 && el.tileId !== '');
            rightTile = board.find(el => el.row === coords.row && el.col === coords.col + 1 && el.tileId !== '');
            if (!upperTile && !lowerTile && !leftTile && !rightTile) {
                console.log("Płytka nie styka sie z innymi");
                setMovePossible(false);
            } else {
                // sprawdzamy u gory
                if (upperTile) {
                    while (upperTile && upperTile.tileId !== '' || coords.row <= 0) {
                        verticalLetters.add(upperTile);
                        if (!newWordsLettersArr.find(wl => wl.tileId === upperTile.tileId)) newWordsLettersArr.push({ rowIndex: upperTile.row, colIndex: upperTile.col, letter: upperTile.letter, tileId: upperTile.tileId, value: upperTile.value });
                        upperTile = board.find(el => el.row === coords.row - 1 && el.col === coords.col && el.tileId !== '');
                        coords = { row: coords.row - 1, col: coords.col }
                    }
                    coords = originCoords;
                }
                // sprawdzamy z dolu
                if (lowerTile) {
                    while (lowerTile && lowerTile.tileId !== '' || coords.row >= 14) {
                        verticalLetters.add(lowerTile);
                        if (!newWordsLettersArr.find(wl => wl.tileId === lowerTile.tileId)) newWordsLettersArr.push({ rowIndex: lowerTile.row, colIndex: lowerTile.col, letter: lowerTile.letter, tileId: lowerTile.tileId, value: lowerTile.value });
                        lowerTile = board.find(el => el.row === coords.row + 1 && el.col === coords.col && el.tileId !== '');
                        coords = { row: coords.row + 1, col: coords.col }
                    }
                    coords = originCoords;
                }
                // sprawdzmy z lewej
                if (leftTile) {
                    while (leftTile && leftTile.tileId !== '' || coords.col <= 0) {
                        horizontalLetters.add(leftTile);
                        if (!newWordsLettersArr.find(wl => wl.tileId === leftTile.tileId)) newWordsLettersArr.push({ rowIndex: leftTile.row, colIndex: leftTile.col, letter: leftTile.letter, tileId: leftTile.tileId, value: leftTile.value });
                        leftTile = board.find(el => el.row === coords.row && el.col === coords.col - 1 && el.tileId !== '');
                        coords = { row: coords.row, col: coords.col - 1 }
                    }
                    coords = originCoords;
                }
                if (rightTile) {
                    while (rightTile && rightTile.tileId !== '' || coords.col >= 14) {
                        horizontalLetters.add(rightTile);
                        if (!newWordsLettersArr.find(wl => wl.tileId === rightTile.tileId)) newWordsLettersArr.push({ rowIndex: rightTile.row, colIndex: rightTile.col, letter: rightTile.letter, tileId: rightTile.tileId, value: rightTile.value });
                        rightTile = board.find(el => el.row === coords.row && el.col === coords.col + 1 && el.tileId !== '');
                        coords = { row: coords.row, col: coords.col + 1 }
                    }
                    coords = originCoords;
                }

                if (verticalLetters.size > 0) {
                    let tile = turnLetters[0];
                    let verticalWordPoints = 0;
                    verticalLetters.add({ row: tile.rowIndex, col: tile.colIndex, letter: tile.letter, value: tile.computedValue, tileId: tile.tileId });
                    const verticalLettersArr = [...verticalLetters];
                    verticalLettersArr.sort((a, b) => a.row - b.row);
                    const sortedVerticalLetters = new Set(verticalLettersArr);
                    sortedVerticalLetters.forEach((vl) => {
                        verticalWord += vl.letter;
                        verticalWordPoints += parseInt(vl.value);
                    });
                    wordsCreated.push({ word: verticalWord, points: verticalWordPoints });
                }
                if (horizontalLetters.size > 0) {
                    let tile = turnLetters[0]
                    let horizontalWordPoints = 0;
                    horizontalLetters.add({ row: tile.rowIndex, col: tile.colIndex, letter: tile.letter, value: tile.computedValue, tileId: tile.tileId });
                    const horizontalLettersArr = [...horizontalLetters];
                    horizontalLettersArr.sort((a, b) => a.col - b.col);
                    const sortedHorizontalLetters = new Set(horizontalLettersArr);
                    sortedHorizontalLetters.forEach((hl) => {
                        horizontalWord += hl.letter;
                        horizontalWordPoints += parseInt(hl.value);
                    });
                    wordsCreated.push({ word: horizontalWord, points: horizontalWordPoints });
                }
            }
        // jesli wylozono wiecej niz jedna plytke
        } else {
            // sprawdzamy czy ulozenie nowych kafelkow jest poziome lub pionowe
            turnLetters.forEach(tl => {
                if (tl.rowIndex !== horizontalAxis) isHorizontal = false;
                if (tl.colIndex !== verticalAxis) isVertical = false;
            });

            /// funkcja pomocnicza do sprawdzania czy nowe kafelki stykaja sie z tymi wylozonymi wczesniej i z ktorej strony
            const bordersWordLetters = (tile) => {
                let upperNeighbor = newWordsLettersArr.find(tl => tl.rowIndex === tile.row - 1 && tl.colIndex === tile.col && tl.tileId !== '');
                let lowerNeighbor = newWordsLettersArr.find(tl => tl.rowIndex === tile.row + 1 && tl.colIndex === tile.col && tl.tileId !== '');
                let leftNeighbor = newWordsLettersArr.find(tl => tl.rowIndex === tile.row && tl.colIndex === tile.col - 1 && tl.tileId !== '');
                let rightNeighbor = newWordsLettersArr.find(tl => tl.rowIndex === tile.row && tl.colIndex === tile.col + 1 && tl.tileId !== '');

                if (isHorizontal) {
                    return (leftNeighbor || rightNeighbor) && !newWordsLettersArr.find(wl => wl.tileId === tile.tileId);
                } else if (isVertical) {
                    return (upperNeighbor || lowerNeighbor) && !newWordsLettersArr.find(wl => wl.tileId === tile.tileId);
                }

            }

            if (isHorizontal && !isVertical) {
                for (let i = 0; i <= 14; i++) {
                    let tile = board.find(el => el.row === horizontalAxis && el.col === i && el.tileId !== '' && !turnLetters.find(tl => tl.tileId === el.tileId) && bordersWordLetters(el));
                    if (tile) {
                        newWordsLettersArr.push({ rowIndex: tile.row, colIndex: tile.col, letter: tile.letter, value: tile.value, tileId: tile.tileId });
                    }
                }
                for (let i = 14; i > 0; i--) {
                    let tile = board.find(el => el.row === horizontalAxis && el.col === i && el.tileId !== '' && !turnLetters.find(tl => tl.tileId === el.tileId) && bordersWordLetters(el));
                    if (tile) {
                        newWordsLettersArr.push({ rowIndex: tile.row, colIndex: tile.col, letter: tile.letter, value: tile.value, tileId: tile.tileId });
                    }
                }
            } else if (isVertical && !isHorizontal) {
                for (let i = 0; i <= 14; i++) {
                    let tile = board.find(el => el.row === i && el.col === verticalAxis && el.tileId !== '' && !turnLetters.find(tl => tl.tileId === el.tileId) && bordersWordLetters(el));
                    if (tile) {
                        newWordsLettersArr.push({ rowIndex: tile.row, colIndex: tile.col, letter: tile.letter, tileId: tile.tileId, value: tile.value });
                    }
                }
                for (let i = 14; i > 0; i--) {
                    let tile = board.find(el => el.row === i && el.col === verticalAxis && el.tileId !== '' && !turnLetters.find(tl => tl.tileId === el.tileId) && bordersWordLetters(el));
                    if (tile) {
                        newWordsLettersArr.push({ rowIndex: tile.row, colIndex: tile.col, letter: tile.letter, tileId: tile.tileId, value: tile.value });
                    }
                }
            }

            turnLetters.forEach(tl => {
                let horizontalLetters = new Set();
                let horizontalWord = "";
                let horizontalWordPoints = 0;
                let verticalLetters = new Set();
                let verticalWord = "";
                let verticalWordPoints = 0
                const originCoords = { row: tl.rowIndex, col: tl.colIndex };
                let coords = { row: tl.rowIndex, col: tl.colIndex };
                upperTile = board.find(el => el.row === coords.row - 1 && el.col === coords.col && el.tileId !== '');
                lowerTile = board.find(el => el.row === coords.row + 1 && el.col === coords.col && el.tileId !== '');
                leftTile = board.find(el => el.row === coords.row && el.col === coords.col - 1 && el.tileId !== '');
                rightTile = board.find(el => el.row === coords.row && el.col === coords.col + 1 && el.tileId !== '');

                if (isHorizontal) {
                    // sprawdzamy u gory
                    if (upperTile) {
                        while (upperTile && upperTile.tileId !== '' || coords.row <= 0) {
                            // previousLetters.push(upperTile);
                            verticalLetters.add(upperTile);
                            upperTile = board.find(el => el.row === coords.row - 1 && el.col === coords.col && el.tileId !== '');
                            coords = { row: coords.row - 1, col: coords.col }
                        }
                        coords = originCoords;
                    }
                    // sprawdzamy z dolu
                    if (lowerTile) {
                        while (lowerTile && lowerTile.tileId !== '' || coords.row >= 14) {
                            // previousLetters.push(lowerTile);
                            verticalLetters.add(lowerTile);
                            lowerTile = board.find(el => el.row === coords.row + 1 && el.col === coords.col && el.tileId !== '');
                            coords = { row: coords.row + 1, col: coords.col }
                        }
                        coords = originCoords;
                    }
                } else if (isVertical) {

                    // sprawdzmy z lewej
                    if (leftTile) {
                        while (leftTile && leftTile.tileId !== '' || coords.col <= 0) {
                            // previousLetters.push(leftTile);
                            horizontalLetters.add(leftTile);
                            leftTile = board.find(el => el.row === coords.row && el.col === coords.col - 1 && el.tileId !== '');
                            coords = { row: coords.row, col: coords.col - 1 }
                        }
                        coords = originCoords;
                    }
                    if (rightTile) {
                        while (rightTile && rightTile.tileId !== '' || coords.col >= 14) {
                            // previousLetters.push(rightTile);
                            horizontalLetters.add(rightTile);
                            rightTile = board.find(el => el.row === coords.row && el.col === coords.col + 1 && el.tileId !== '');
                            coords = { row: coords.row, col: coords.col + 1 }
                        }
                        coords = originCoords;
                    }
                }

                if (verticalLetters.size > 0) {
                    verticalLetters.add({ row: tl.rowIndex, col: tl.colIndex, letter: tl.letter, tileId: tl.tileId, value: tl.computedValue });
                    const verticalLettersArr = [...verticalLetters];
                    verticalLettersArr.sort((a, b) => a.row - b.row);
                    const sortedVerticalLetters = new Set(verticalLettersArr);
                    sortedVerticalLetters.forEach((vl) => {
                        verticalWord += vl.letter;
                        verticalWordPoints += parseInt(vl.value);
                    });
                    wordsCreated.push({ word: verticalWord, points: verticalWordPoints });
                }
                if (horizontalLetters.size > 0) {
                    horizontalLetters.add({ row: tl.rowIndex, col: tl.colIndex, letter: tl.letter, tileId: tl.tileId, value: tl.computedValue });;
                    const horizontalLettersArr = [...horizontalLetters];
                    horizontalLettersArr.sort((a, b) => a.col - b.col);
                    const sortedHorizontalLetters = new Set(horizontalLettersArr);
                    sortedHorizontalLetters.forEach((hl) => {
                        horizontalWord += hl.letter;
                        horizontalWordPoints += parseInt(hl.value);
                    });
                    wordsCreated.push({ word: horizontalWord, points: horizontalWordPoints });
                }
            });

            let sum = 0;
            let bonusWordMultiplier = 1;

            // if (isHorizontal) {
            //     newWordsLettersArr.sort((a, b) => a.colIndex - b.colIndex);
            // } else if (isVertical) {
            //     newWordsLettersArr.sort((a, b) => a.rowIndex - b.rowIndex);
            // }
            
            // newWordsLettersArr.forEach(tl => {
            //     word += tl.letter;
            //     sum += parseInt(tl.value);
            //     if (doubleWordScores.find(el => el.x === tl.rowIndex && el.y === tl.colIndex)) bonusWordMultiplier = 2;
            //     if (tripleWordScores.find(el => el.x === tl.rowIndex && el.y === tl.colIndex)) bonusWordMultiplier = 3;
            // });

            // wordsCreated.push({ word: word, points: sum * bonusWordMultiplier });

            if (isHorizontal) {
                newWordsLettersArr.sort((a, b) => a.colIndex - b.colIndex);
            } else if (isVertical) {
                newWordsLettersArr.sort((a, b) => a.rowIndex - b.rowIndex);
            }

            
            console.log("Sorted newWordsLettersArr:", newWordsLettersArr);
            
            newWordsLettersArr.forEach(tl => {
                word += tl.letter;
                sum += parseInt(tl.value);
                if (doubleWordScores.find(el => el.x === tl.rowIndex && el.y === tl.colIndex)) bonusWordMultiplier = 2;
                if (tripleWordScores.find(el => el.x === tl.rowIndex && el.y === tl.colIndex)) bonusWordMultiplier = 3;
                console.log("Current tl:", tl);
                console.log("Current word:", word);
                console.log("Current sum:", sum);
                console.log("Current bonusWordMultiplier:", bonusWordMultiplier);
            });
            
            wordsCreated.push({ word: word, points: sum * bonusWordMultiplier });
            
        }

        /// pierwsza tura
        if (turnCount === 0) {
            if (turnLetters.length < 2) {
                console.log("Za mało liter");
                setMovePossible(false);
            } else if (!turnLetters.find(el => el.rowIndex === 7 && el.colIndex === 7)) {
                console.log("Zły punkt startowy");
                setMovePossible(false);
            }
        }
        if (turnLetters.length > 1 && (!isHorizontal && !isVertical)) {
            console.log("Niepoprawne ulozenie kafelkow");
            setMovePossible(false);
        }

        if (wordsCreated.length === 0) {
            setMovePossible(false);
        }

        setWords(wordsCreated);

    };

    const handleMoveConfirmation = async () => {
        const validatedWords = await validateWords(words);
        if(validatedWords) {
            await socket.emit("moveConfirmed", { room: room, login: login, newWords: words, turnPoints: turnPoints, newTilesNumber: turnLetters.length });
            setTurnPoints(0);
            setTurnLetters([]);
            setMovePossible(false);
            getTiles(room);
            const emptyRackPlaces = tilesOnRack.filter((place) => place.tile.value === "");
            if(emptyRackPlaces.length === 7 && numberOfTilesLeft === 0) {
                socket.emit("end_of_letters", { login: login, room: room});
            }
            console.log("Wszystkie slowa poprawne");
        } else {
            // inne instrukcje
            console.log("Nie wszystkie slowa poprawne");
        }
        
    };

    const restartTurnLetters = () => {

        let emptyRackPlaces = tilesOnRack.filter((place) => place.tile.value === "");
        let takenRackPlaces = tilesOnRack.filter((place) => place.tile.value !== "");
        let newRackPlaces = [];

        turnLetters.forEach((tl) => {
            const emptyPlace = emptyRackPlaces.shift();
            newRackPlaces.push({ id: emptyPlace.id, tile: { id: tl.tileId, letter: tl.letter, value: tl.value } });
        });

        const newBoard = board.map((cell) => {
            if (turnLetters.find(tl => tl.tileId === cell.tileId)) {
                return { ...cell, letter: '', value: '', tileId: '' }
            } else return cell
        });

        setBoard(newBoard);
        setNumberOfLettersToGet(numberOfLettersToGet - turnLetters.length);
        socket.emit("update_board", { room: room, board: newBoard });
        setTurnLetters([]);
        setTurnPoints(0);

        newRackPlaces = newRackPlaces.concat(takenRackPlaces);
        newRackPlaces.sort((a, b) => a.id - b.id);
        setTilesOnRack(newRackPlaces);

    }
      
    const confirmMove = () => {
        if (turnLetters.length > 0) {
            handleMoveConfirmation();
        }
    }

    const validateWords = async (wordsArray) => {
        let allWordsValid = true;
        await axios.post("http://localhost:3001/scrabble/validateWords", { words: wordsArray })
        .then((res) => {
            res.data.wordsValidationResult.forEach((word) => {
                if(!word.isWord) {
                    allWordsValid = false;
                    return;
                }
            });
        })
        .catch((err) => {
            console.log(err);
        })
        return allWordsValid;
    };

    const handleSkip = () => {
        socket.emit("skipTurn", { room: room, login: login, cause: "manualSkip"});
    };

    const startTimer = () => {
        setIsTimerActive(true);
      };
    
    const pauseTimer = () => {
        setIsTimerActive(false);
    };

    const resetTimer = () => {
        setTimer(300);
    };
    

    useEffect(() => {
        if (turnLetters.length > 0) {
          wordFromLetters();
        } else {
            setMovePossible(false);
        }
      }, [turnLetters]);

      useEffect(() => {
        let sum = 0;
        words.forEach((word) => {
          sum += word.points;
        });
        if(turnLetters.length === 7) {
            sum += 50;
        }
        setTurnPoints(sum);
      }, [words]);

      useEffect(() => {
        if(!movePossible) {
            setWords([]);
        }
      }, [movePossible]);


    return (

        <WrapperContext.Provider value={{ winner, gameEnded, restartTurnLetters, handleSkip, wordFromLetters, room, setRoom, getTiles, movePossible, turnCount, movesList, hostUser, setHostUser, isGameStarted, setIsGameStarted, gamePoints, setGamePoints, turnPoints, setTurnPoints, turnLetters, setTurnLetters, isMyTurn, whoseTurn, confirmMove, board, setBoard, loginMessage, setLoginMessage, handleLogOut, doLogin, doSignUp, connectedUsers, availableRooms, socket, shuffleTiles, getTiles, tilesOnRack, numberOfTilesLeft, setTilesOnRack, removeTileFromRack, removeTileFromBoard, isInRoom, setIsInRoom, login, setLogin, isAuth }}>
            <>
                <div className='app-container'>

                    {isAuth ?
                        <LoggedIn
                        timer={timer}
                        setTimer={setTimer}
                        isTimerActive={isTimerActive}
                        setIsTimerActive={setIsTimerActive}
                        />
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