import React from 'react';
import Tile from './Tile';
import { WrapperData } from '../Wrapper';

function TileRack() {

    const { tilesOnRack, setTilesOnRack } = WrapperData();

    const updateRack = (event, id) => {
      event.preventDefault();

      const newRack = tilesOnRack.map((singleTile) => {
        if(singleTile.id === id) {
          return {...singleTile, letter: "", value: null}
        } else {
          return singleTile;
        }

      });

      setTilesOnRack(newRack);
    }

  return (
    <div className='lettersAndOptions'>

        <div className='tileRack'>
        {tilesOnRack.map((tile) =>

        <Tile key={tile.id} letter={tile.letter} value={tile.value} updateRack={(e) => updateRack(e, tile.id)}/>

            
        )}
        </div>


    </div>
  )
}

export default TileRack