import React from 'react'
import { WrapperData } from '../Wrapper';

function PlaceForTile(props) {

  const { selectLettersModeActive, tilesOnRack } = WrapperData();
 
  const { setSelectedTiles, selectedTiles } = props;

    const letter = props.placeForTile.tile.letter;
    const value = props.placeForTile.tile.value;
    const placeId = props.placeForTile.id;

    const handleDragEndFromTileRack = (e) => {
      ///
    };

    const handleDragOverOnTileRack = (e) => {
      ///
    };

    const handleClick = () => {
      if (selectedTiles.includes(placeId)) {
        setSelectedTiles((prevSelected) => prevSelected.filter((id) => id !== placeId));
      } else {
        setSelectedTiles((prevSelected) => [...prevSelected, placeId]);
      }
    };

    let tileClass = "placeForTile";
    let isDraggable = "false";
    if(value !== "") {
      tileClass = "tileMovable";
      isDraggable = "true";
    }
    if(selectLettersModeActive && value !== "") {
      tileClass = "placeForTileToSelect";
    }
    let isSelected = selectedTiles.includes(placeId);
    if(isSelected) {
      tileClass = "placeForTileSelected";
    }

  return (
    <div className={tileClass}
         draggable={isDraggable}
         onClick={handleClick}         
         onDrop={e => props.handleDropOnTileRack(e, placeId)}
         onDragOver={props.allowDropOnTileRack}
         onDragStart={e => props.handleDragStartFromTileRack(e, props.placeForTile)}
         onDragEnd={handleDragEndFromTileRack}
         key={placeId}
          >
          <div className='letter'>{letter}</div>
          <div className='value'>{value}</div>
    </div>
  )
}

export default PlaceForTile