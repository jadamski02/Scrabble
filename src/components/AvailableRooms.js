import React from 'react'
import { WrapperData } from '../Wrapper';
import Room from './Room';

function AvailableRooms() {

  const { availableRooms } = WrapperData();
  return (
    <div className='availableRooms'>
      <h3>Dołącz do pokoju</h3>
      {availableRooms.length === 0 ?  <h4>Brak dostępnych pokoi</h4> : null}
      {availableRooms.map((room, index) => (
        <Room key={index} room={room}/>
      ))}
    </div>
  )
}

export default AvailableRooms