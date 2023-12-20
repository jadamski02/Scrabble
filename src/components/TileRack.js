import React from 'react';
import PlaceForTile from './PlaceForTile';
import { WrapperData } from '../Wrapper';

function TileRack() {

    const { tilesOnRack } = WrapperData();

  return (
    <div className='lettersAndOptions'>

        <div className='tileRack'>
        {tilesOnRack.map((placeForTile) =>

        <PlaceForTile key={placeForTile.id} placeForTile={placeForTile} />

        )}
        </div>


    </div>
  )
}

export default TileRack