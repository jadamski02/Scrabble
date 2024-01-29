import React from 'react'
import { WrapperData } from '../Wrapper'

function Buttons() {

    const { isMyTurn, handleSkip, movePossible, shuffleTiles, confirmMove, restartTurnLetters } = WrapperData();

  return (
    <div className='buttons'>
        <button className='gameButton' onClick={shuffleTiles}><i className="material-icons">shuffle</i></button>
        <button className='gameButton'disabled={isMyTurn ? false : true} >Zamień</button>
        <button className='gameButton' onClick={confirmMove} disabled={!movePossible}>Potwierdź</button>
        <button className='gameButton' disabled={isMyTurn ? false : true} onClick={handleSkip}>Pomiń</button>
        <button className='gameButton' disabled={isMyTurn ? false : true} onClick={restartTurnLetters}><i className="material-icons">restart_alt</i></button>
    </div>
  )
}

export default Buttons