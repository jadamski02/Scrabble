import React, { useEffect } from 'react';
import Cell from './Cell';
import { WrapperData } from '../Wrapper';
import { doubleLetterScores, doubleWordScores, tripleLetterScores, tripleWordScores } from './ExtraPoints';

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

  const { validateMove, socket, room, removeTileFromRack, board, setBoard, turnLetters, setTurnLetters, setTurnPoints } = WrapperData();

  const handleDragStartFromCell = (e, cell, isDraggable) => {
    if(isDraggable) {
      e.dataTransfer.setData("from", "board");
      e.dataTransfer.setData("letter", cell.letter);
      e.dataTransfer.setData("value", cell.value);
      e.dataTransfer.setData("tileId", cell.tileId);
      e.dataTransfer.setData("rowId", cell.row);
      e.dataTransfer.setData("colId", cell.col);
    }
  };

  const allowDropOnCell = (event) => {
    const isEmptyCell = ['tileMovable', 'tileSet', 'letter', 'value'].indexOf(event.target.className) !== -1;
    if(!isEmptyCell) {
      event.preventDefault();
    }
  };
  
  const handleDropOnCell = (event, rowIndex, colIndex) => {
    event.preventDefault();

    const dragSource = event.dataTransfer.getData("from");
    const letter = event.dataTransfer.getData("letter");
    const tileEvent = event.dataTransfer.getData("tileEvent");
    const value = parseInt(event.dataTransfer.getData("value"));
    const tileId = parseInt(event.dataTransfer.getData("tileId"));
    const placeId = parseInt(event.dataTransfer.getData("placeId"));
    const rowId = parseInt(event.dataTransfer.getData("rowId"));
    const colId = parseInt(event.dataTransfer.getData("colId"));

    let bonusLetterMultiplier = 1;

    const is2WordScore = doubleLetterScores.find(el => el.x === rowIndex && el.y === colIndex);
      if(is2WordScore) {
        bonusLetterMultiplier = 2;
      }
      
    const is3WordScore = tripleLetterScores.find(el => el.x === rowIndex && el.y === colIndex);
      if(is3WordScore) {
        bonusLetterMultiplier = 3;
      }

    let updatedBoard;

    /// tworzymy nowa zmienna tablicowa zawierajaca kafelki wylozone oraz sume punktow z tych kafelkow  w danej rundzie
    let newLettersArr = [...turnLetters];

    if(dragSource === "tileRack") {
      /// aktualizujemy plansze z dodanym kafelkiem z podstawki
      updatedBoard = board.map((cell) => {
        if(cell.row === rowIndex && cell.col === colIndex) {
          return {...cell, letter, value, tileId};
        }
        return cell;
        });

        /// usuwamy z podstawki wykorzystany kafelek
        removeTileFromRack(tileEvent, placeId);

    } else if(dragSource === "board") {
      /// aktualizujemy plansze, przekladamy kafelek, a w jego miejsce wstawiamy puste miejsce
      updatedBoard = board.map((cell) => {
        if(cell.row === rowIndex && cell.col === colIndex) {
          return {...cell, letter, value, tileId};
        } else if(cell.row === rowId && cell.col === colId) {
          return {...cell, letter: '',value: '', tileId: ''}
        }
        return cell;
        });

        /// usuwamy kafelek ze starego miejsca na planszy w celu ponownego przeliczenia punktow
        newLettersArr = newLettersArr.filter(tl => tl.tileId !== tileId);
    }

    /// do tablicy dodajemy wylozony kafelek z policzonymi punktami i aktualizujemy stan 
    newLettersArr.push({letter, tileId, computedValue: value * bonusLetterMultiplier, rowIndex, colIndex})
    setTurnLetters(newLettersArr);

    /// aktualizujemy stan planszy lokalnie
    setBoard(updatedBoard); 
    /// aktualizujemy stan planszy u wszystkich graczy w pokoju
    socket.emit("update_board", { room: room, board: updatedBoard });
      
    };

    useEffect(() => {
      setBoard(createEmptyBoard(15, 15));
    
      const handleUpdateBoard = ({ board }) => {
        setBoard(board);
      };
    
      socket.on("update_board", handleUpdateBoard);
    
      return () => {
        socket.off("update_board", handleUpdateBoard);
      };
    }, [setBoard, socket]);

    useEffect(() => {
      if(turnLetters.length > 0) validateMove();
    }, [turnLetters, setTurnLetters]);
    



  return (
    <div className="scrabble-board">
      {board.map((cell, index) => 
      {
        const isDraggable = turnLetters.find(el => el.tileId === cell.tileId);
        let cellStyle = "cell";
        let bonusPlaceholder = "";

        const isDoubleWordScore = doubleWordScores.find(el => el.x === cell.row && el.y === cell.col);
        if(isDoubleWordScore) {
          cellStyle = "doubleWordScore";
          bonusPlaceholder = "2S"
        }
      
        const isTripleWordScore = tripleWordScores.find(el => el.x === cell.row && el.y === cell.col);
        if(isTripleWordScore) {
          cellStyle = "tripleWordScore";
          bonusPlaceholder = "3S"
        }
      
        const isDoubleLetterScore = doubleLetterScores.find(el => el.x === cell.row && el.y === cell.col);
        if(isDoubleLetterScore) {
          cellStyle = "doubleLetterScore";
          bonusPlaceholder = "2L"
        }
      
        const isTripleLetterScore = tripleLetterScores.find(el => el.x === cell.row && el.y === cell.col);
        if(isTripleLetterScore) {
          cellStyle = "tripleLetterScore";
          bonusPlaceholder = "3L";
        }
      
        if(cell.row === 7 && cell.col === 7) cellStyle = "middleCell";
        
        if(cell.value !== '' && isDraggable) {
          cellStyle="tileMovable";
        } else if(cell.value !== '' && !isDraggable) {
          cellStyle="tileSet";
        }

        return (
          <Cell
            key={index}
            cell={cell}
            isDraggable={isDraggable}
            bonusPlaceholder={bonusPlaceholder}
            cellStyle={cellStyle}
            colIndex={cell.col}
            rowIndex={cell.row}
            letter={cell.letter}
            value={cell.value}
            tileId={cell.tileId}
            handleDropOnCell={handleDropOnCell}
            allowDropOnCell={allowDropOnCell}
            handleDragStartFromCell={handleDragStartFromCell}
          />
        )
      }
      )}
    </div>
  );
};

export default ScrabbleBoard;
