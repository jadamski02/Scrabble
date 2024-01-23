import React from 'react'

function PlaceForTile(props) {

    const letter = props.placeForTile.tile.letter;
    const value = props.placeForTile.tile.value;
    const placeId = props.placeForTile.id;

    const handleDragEndFromTileRack = (e) => {
      ///
    };

    const handleDragOverOnTileRack = (e) => {
      ///
    };

    let tileClass = "placeForTile";
    let isDraggable = "false";
    if(value !== "") {
      tileClass = "tileMovable";
      isDraggable = "true";
    }

  return (
    <div className={tileClass}
         draggable={isDraggable}
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