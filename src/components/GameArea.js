import React from 'react'
import ScrabbleBoard from './ScrabbleBoard';
import TileRack from './TileRack';
import Buttons from './Buttons';

function GameArea() {
  return (
    <div className="game-area">
        <ScrabbleBoard />
        <TileRack />
        <Buttons />
  </div>
  )
}

export default GameArea