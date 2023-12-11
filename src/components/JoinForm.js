import '../App.css';

function JoinForm(props) {

  const joinRoom = () => {
    if(props.room !== "") {
      props.socket.emit("join_room",  { username: props.username, room: props.room });
      props.setIsInRoom(true);
    }
  }; 
  return (
    <div className="joinForm">

      <h1>Scrabble online</h1>

      <input placeholder='Nazwa użytkownika...' onChange={(event) => {
        props.setUsername(event.target.value);
      }}
      />
      <br/>
      <input placeholder='Numer pokoju...' onChange={(event) => {
        props.setRoom(event.target.value);
      }}
      />
      <br/>
      <button onClick={joinRoom}>Dołącz do pokoju</button>
    
    </div>
  );
}

export default JoinForm;
