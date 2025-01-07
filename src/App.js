import { useState } from "react";

function ToggleButton({ value, onToggleButtonClick }) {
  return (
    <button onClick={onToggleButtonClick} >
      {value}
    </button>
  );
}

function Square({ value, onSquareClick, highlight }) {
  let className = `square`;
  if (highlight) {
    className += ' highlight';
  }

  return (
    <button className={className} onClick={onSquareClick} >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  let winningLine;
  if (winnerInfo) {
    status = `Winner: ` + winnerInfo.winner;
    winningLine = winnerInfo.line;
  } else if (currentMove === 9) {
    status = `Result is a draw`;
  } else {
    status = `Next Player: ` + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        [...Array(3)].map((_, rowIndex) => (
          <div className='board-row' key={rowIndex}>
            {
              [...Array(3)].map((_, colIndex) => (
                <Square
                  key={rowIndex * 3 + colIndex}
                  value={squares[rowIndex * 3 + colIndex]}
                  onSquareClick={() => handleClick(rowIndex * 3 + colIndex)}
                  highlight={winningLine ? winningLine.includes(rowIndex * 3 + colIndex) : false}
                />
              ))
            }
          </div>
        ))
      }
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function onToggleButtonClick() {
    setSortAscending(!sortAscending);
  }

  const moves = history.map((squares, move) => {
    let description, showButton = true;
    const prevSquares = history[move - 1];
    let thisMove = '';

    if (move > 0) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (prevSquares[row * 3 + col] !== squares[row * 3 + col]) {
            thisMove = ` (${row},${col})`;
          }
        }
      }
    }

    if (move === currentMove) {
      description = 'You are at move #' + move + thisMove;
      showButton = false;
    } else if (move > 0) {
      description = 'Go to move #' + move + thisMove;
    } else {
      description = 'Go to game start';
    }

    if (showButton) {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <div className="status-text">{description}</div>
        </li>
      );
    }
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <ol>{sortAscending ? moves : moves.reverse()}</ol>
      </div>
      <div className='toggle-button'>
        <ToggleButton value={"Show moves in " + (sortAscending ? "descending" : "ascending") + " order"} onToggleButtonClick={onToggleButtonClick} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  return null;
}
