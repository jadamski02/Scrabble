import React from 'react';
import Tile from './Tile';
import { WrapperData } from '../Wrapper';

function TileRack() {

    const { tilesOnRack } = WrapperData();

  return (
    <div className='lettersAndOptions'>

        <div className='tileRack'>
        {tilesOnRack.map((tile) =>

        <Tile key={tile.id} id={tile.id} letter={tile.letter} value={tile.value}/>

            
        )}
        </div>


    </div>
  )
}

export default TileRack