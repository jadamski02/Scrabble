import React, { Children } from 'react';
import PlaceForTile from './PlaceForTile';
import { WrapperData } from '../Wrapper';

function TileRack() {

    const { tilesOnRack, setTilesOnRack, removeTileFromBoard, turnLetters, setTurnLetters } = WrapperData();

    const allowDropOnTileRack = (event) => {
      const isEmptyPlace = ['tileSet', 'tileMovable', 'letter', 'value'].indexOf(event.target.className) != -1;
      if(!isEmptyPlace) {
        event.preventDefault();
      }
    };

    const handleDropOnTileRack = (event, placeIdTarget) => {    
      event.preventDefault();

      const dragSource = event.dataTransfer.getData("from");
      const letter = event.dataTransfer.getData("letter");
      const placeIdSource = event.dataTransfer.getData("placeId");
      const value = parseInt(event.dataTransfer.getData("value"));
      const tileId = parseInt(event.dataTransfer.getData("tileId"));
      const rowId = parseInt(event.dataTransfer.getData("rowId"));
      const colId = parseInt(event.dataTransfer.getData("colId"));

      let updatedTileRack;

      if(dragSource === "tileRack") {
        updatedTileRack = tilesOnRack.map((place) => {
          if(place.id === placeIdTarget) {
            return {... place, tile: {id: tileId, letter: letter, value: value}}
          } else if(place.id == placeIdSource) {
            return {... place, tile: {id: "", letter: "", value: ""}}
          } else return place;
        });
      } else if(dragSource === "board") {
        updatedTileRack = tilesOnRack.map((place) => {
          if(place.id === placeIdTarget) {
            return {... place, tile: {id: tileId, letter: letter, value: value}}
          } else return place;
        });
        removeTileFromBoard(event, rowId, colId);
        let newLettersArr = turnLetters.filter((tl) => tl.tileId !== tileId);
        setTurnLetters(newLettersArr);        
      }
      

      setTilesOnRack(updatedTileRack);

    };

    const handleDragStartFromTileRack = (e, placeForTile) => {
      e.dataTransfer.setData("from", "tileRack");
      e.dataTransfer.setData("letter", placeForTile.tile.letter);
      e.dataTransfer.setData("value", placeForTile.tile.value);
      e.dataTransfer.setData("tileId", placeForTile.tile.id);
      e.dataTransfer.setData("placeId", placeForTile.id);
      e.dataTransfer.setData("tileEvent", e);
    }



  return (
    <div className='lettersAndOptions'>

        <div className='tileRack'>
        {tilesOnRack.map((placeForTile) =>

        <PlaceForTile 
        key={placeForTile.id} 
        placeForTile={placeForTile} 
        handleDropOnTileRack={handleDropOnTileRack}
        handleDragStartFromTileRack={handleDragStartFromTileRack}
        allowDropOnTileRack={allowDropOnTileRack}
        />

        )}
        </div>


    </div>
  )
}

export default TileRack