import React from 'react'
import { WrapperData } from '../Wrapper'

function Buttons() {

    const { movePossible, getTiles, shuffleTiles, confirmMove, restartTurnLetters } = WrapperData();

  return (
    <div className='buttons'>
        <button className='gameButton' onClick={shuffleTiles}><i className="material-icons">shuffle</i></button>
        <button className='gameButton'>Zamień</button>
        <button className='gameButton' onClick={confirmMove} disabled={!movePossible}>Potwierdź</button>
        <button className='gameButton'>Pomiń</button>
        <button className='gameButton' onClick={getTiles}>Dobierz</button>
        <button className='gameButton' onClick={restartTurnLetters}><i className="material-icons">restart_alt</i></button>
    </div>
  )
}

export default Buttons