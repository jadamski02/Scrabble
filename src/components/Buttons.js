import React from 'react'
import { Wrapper, WrapperData } from '../Wrapper'

function Buttons() {

    const { getTiles } = WrapperData();

  return (
    <div className='buttons'>
        <button className='gameButton'><i className="material-icons">shuffle</i></button>
        <button className='gameButton'>Zamień</button>
        <button className='gameButton'>Potwierdź</button>
        <button className='gameButton'>Pomiń</button>
        <button className='gameButton' onClick={getTiles}>Dobierz</button>
    </div>
  )
}

export default Buttons