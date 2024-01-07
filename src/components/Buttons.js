import React from 'react'
import { WrapperData } from '../Wrapper'

function Buttons() {

    const { getTiles, shuffleTiles, confirmMove } = WrapperData();

  return (
    <div className='buttons'>
        <button className='gameButton' onClick={shuffleTiles}><i className="material-icons">shuffle</i></button>
        <button className='gameButton'>Zamień</button>
        <button className='gameButton' onClick={confirmMove}>Potwierdź</button>
        <button className='gameButton'>Pomiń</button>
        <button className='gameButton' onClick={getTiles}>Dobierz</button>
    </div>
  )
}

export default Buttons