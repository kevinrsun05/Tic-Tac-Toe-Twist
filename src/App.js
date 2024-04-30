import { useState } from "react";

function Square({ value, onSquareClick }) {
  return <button className="square" onClick = {onSquareClick}>{value}</button>;
}


function Board({xIsNext, squares, onPlay, prev, setPrev, countMove}) {
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  //0 1 2
  //3 4 5
  //6 7 8
  function isAdjacent(index1, index2) {
    let adj = []
    if (index1 == 0) {
      adj = [1, 3, 4];
    }
    else if (index1 == 1) {
      adj = [0,2,3,4,5];
    }
    else if (index1 == 2) {
      adj = [1,4,5];
    }
    else if (index1 == 3) {
      adj = [0,1,4,6,7];
    }
    else if (index1 == 4) {
      adj = [0,1,2,3,5,6,7,8];
    }
    else if (index1 == 5) {
      adj = [1,2,4,7,8];
    }
    else if (index1 == 6) {
      adj = [3,4,7];
    }
    else if (index1 == 7) {
      adj = [3,4,5,6,8];
    }
    else if (index1 == 8) {
      adj = [4,5,7];
    }
    return adj.includes(index2)
  }

  function handleClick(i) {
    if ((squares[i] && countMove <= 5) || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    if (countMove > 5) {
      if (prev.index == null) {
        if (xIsNext && nextSquares[i] == "X") {
          setPrev({index: i, letter: "X"});
        }
        else if (!xIsNext && nextSquares[i] == "O") {
          setPrev({index: i, letter: "O"});
        }
        else {
          return;
        }
      }
      else {
        if (xIsNext) {
          let middle = (nextSquares[4] == "X");
          if (nextSquares[i] == null && prev.letter == "X" && isAdjacent(prev.index, i)) {
            nextSquares[prev.index] = null;
            nextSquares[i] = "X";
            if (middle) {
              if (nextSquares[4] != "X" || calculateWinner(nextSquares) != null) {
                onPlay(nextSquares)
              }
            }
            else{
              onPlay(nextSquares);
            }
          }
          setPrev({index: null, letter: null});
        }
        else {
          let middle = (nextSquares[4] == "O");
          if (nextSquares[i] == null && prev.letter == "O" && isAdjacent(prev.index, i)) {
            nextSquares[prev.index] = null;
            nextSquares[i] = "O";
            if (middle) {
              if (nextSquares[4] != "O" || calculateWinner(nextSquares) != null) {
                onPlay(nextSquares)
              }
            }
            else{
              onPlay(nextSquares);
            }
          }
          setPrev({index: null, letter: null});
        }
      }
    }
    else {
      if (xIsNext) {
        nextSquares[i] = "X";
      }
      else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    }
    
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className = "status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick = {() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick = {() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick = {() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick = {() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick = {() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick = {() => handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick = {() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick = {() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick = {() => handleClick(8)} />
      </div>
    </>
  );
}



export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //array that holds squares (array of 9 to represent board)
  const [currentMove, setCurrentMove] = useState(0) //The current move the game is on, starts off as 0
  const currentSquare = history[currentMove]; //The square we are working with right now
  const xIsNext = currentMove%2 == 0; //Is X the next move?
  const [prevClicked, setPrevClicked] = useState({index: null, letter: null});

  function handlePlay(nextSquares) { //nextSquares is the next square to be put into history
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; //slice 0 to currentMove # and add on the next Square move
    setHistory(nextHistory); //history won't change until next render
    setCurrentMove(nextHistory.length - 1); //currentMove will change next render
  }

  function jumpTo(nextMove) { //For going back moves
    setCurrentMove(nextMove); //changes next render
  }

  //First argument (squares): current element being processed in the array Second: index of the current element being processed
  //Optional third argument (not used here) array that map was called upon
  const moves = history.map((squares, move) => { 
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    }
    else {
      description = "Go to game start";
    }
    //each element needs an ID
    return (
      <li key = {move}> 
        <button onClick = {() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className = "game">
      <div className = "game-board">
        <Board xIsNext = {xIsNext} squares = {currentSquare} onPlay = {handlePlay} prev = {prevClicked} setPrev = {setPrevClicked} countMove = {currentMove}/>
      </div>
      <div className = "game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
