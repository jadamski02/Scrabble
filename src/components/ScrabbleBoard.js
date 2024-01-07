import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { WrapperData } from '../Wrapper';

const createEmptyBoard = (rows, cols) => {
  const board = [];
  for (let i = 0; i < rows * cols; i++) {
    board.push({
      row: Math.floor(i / cols),
      col: i % cols,
      letter: '',
      value: '',
      tileId: ''
    });
  }
  return board;
};

const ScrabbleBoard = () => {

  const { socket, room, removeTileFromRack, board, setBoard, turnLetters, setTurnLetters } = WrapperData();

  const handleDragStartFromCell = (e, cell) => {
    e.dataTransfer.setData("from", "board");
    e.dataTransfer.setData("letter", cell.letter);
    e.dataTransfer.setData("value", cell.value);
    e.dataTransfer.setData("tileId", cell.tileId);
    e.dataTransfer.setData("rowId", cell.row);
    e.dataTransfer.setData("colId", cell.col);

  };

  const allowDropOnCell = (event) => {
    const isEmptyCell = ['tile', 'letter', 'value'].indexOf(event.target.className) != -1;
    if(!isEmptyCell) {
      event.preventDefault();
    }
  };
  
  const handleDropOnCell = (event, rowIndex, colIndex) => {
    event.preventDefault();

    const dragSource = event.dataTransfer.getData("from");
    const letter = event.dataTransfer.getData("letter");
    const value = event.dataTransfer.getData("value");
    const tileId = event.dataTransfer.getData("tileId");
    const placeId = event.dataTransfer.getData("placeId");
    const tileEvent = event.dataTransfer.getData("tileEvent");
    const rowId = event.dataTransfer.getData("rowId");
    const colId = event.dataTransfer.getData("colId");

    // let newArr = [...turnLetters];
    // const newOnBoard = turnLetters.findIndex(tl => tl.tileId == tileId) == -1;
    // console.log(newOnBoard)
    // if(newOnBoard) {
      
    // }

    let updatedBoard;

    if(dragSource === "tileRack") {
      updatedBoard = board.map((cell) => {
        if(cell.row === rowIndex && cell.col === colIndex) {
          return {...cell, letter, value, tileId};
        }
        return cell;
        });
        setBoard(updatedBoard);
        removeTileFromRack(tileEvent, placeId);
        let newLettersArr = [...turnLetters];
        newLettersArr.push({letter, tileId, value, rowIndex, colIndex})
        setTurnLetters(newLettersArr);
    } else if(dragSource === "board") {
      updatedBoard = board.map((cell) => {
        if(cell.row === rowIndex && cell.col === colIndex) {
          return {...cell, letter, value, tileId};
        } else if(cell.row == rowId && cell.col == colId) {
          return {...cell, letter: '',value: '', tileId: ''}
        }
        return cell;
        });
        setBoard(updatedBoard);
        // removeTileFromBoard()
    }

      socket.emit("update_board", { room: room, board: updatedBoard });
      
    };

  useEffect(() => {
    setBoard(createEmptyBoard(15, 15));
    socket.on("update_board", ({ board }) => {
      setBoard(board);
    });

  }, []);

  return (
    <div className="scrabble-board">
      {board.map((cell, index) => (
        <Cell
          key={index}
          cell={cell}
          colIndex={cell.col}
          rowIndex={cell.row}
          letter={cell.letter}
          value={cell.value}
          tileId={cell.tileId}
          handleDropOnCell={handleDropOnCell}
          allowDropOnCell={allowDropOnCell}
          handleDragStartFromCell={handleDragStartFromCell}
        />
      ))}
    </div>
  );
};

export default ScrabbleBoard;
