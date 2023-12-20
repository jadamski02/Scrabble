import React from 'react'

function PlaceForTile(props) {

    const letter = props.placeForTile.tile.letter;
    const value = props.placeForTile.tile.value;
    const placeId = props.placeForTile.id;

    const handleDragStartFromTileRack = (e) => {
        e.dataTransfer.setData("letter", letter);
        e.dataTransfer.setData("value", value);
        e.dataTransfer.setData("placeId", placeId);
        e.dataTransfer.setData("tileEvent", e);
     };

     const handleDragEndFromTileRack = (e) => {
        ///
      };
  
      const handleDragOverOnTileRack = (e) => {
       ///
      };
  
      const handleDropOnTileRack = (e) => {
        ///
      };

    let tileClass = "placeForTile";
    let isDraggable = "false";
    if(value !== "") {
      tileClass = "tile";
      isDraggable = "true";
    }

  return (
    <div className={tileClass}
         draggable={isDraggable}
         onDrop={handleDropOnTileRack}
         onDragOver={handleDragOverOnTileRack}
         onDragStart={handleDragStartFromTileRack}
         onDragEnd={handleDragEndFromTileRack}
         key={placeId}
          >
          <div className='letter'>{letter}</div>
          <div className='value'>{value}</div>
    </div>
  )
}

export default PlaceForTile