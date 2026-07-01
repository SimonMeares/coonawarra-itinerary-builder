import React, { useState } from 'react';

const NAVY = '#192957';
const TEAL = '#40c0c0';
const SAND = '#d8c69d';
const TERRACOTTA = '#d34727';

const cellIdx = (l, r, c) => l * 9 + r * 3 + c;

function generateWinningLines() {
  const lines = [];

  // Within each layer: 3 rows + 3 cols + 2 diagonals = 8 lines × 3 layers = 24
  for (let l = 0; l < 3; l++) {
    for (let r = 0; r < 3; r++)
      lines.push({ cells: [cellIdx(l,r,0), cellIdx(l,r,1), cellIdx(l,r,2)], type: `Row ${r+1} in Layer ${l+1}` });
    for (let c = 0; c < 3; c++)
      lines.push({ cells: [cellIdx(l,0,c), cellIdx(l,1,c), cellIdx(l,2,c)], type: `Column ${c+1} in Layer ${l+1}` });
    lines.push({ cells: [cellIdx(l,0,0), cellIdx(l,1,1), cellIdx(l,2,2)], type: `Diagonal in Layer ${l+1}` });
    lines.push({ cells: [cellIdx(l,0,2), cellIdx(l,1,1), cellIdx(l,2,0)], type: `Diagonal in Layer ${l+1}` });
  }

  // Vertical pillars through all 3 layers: 9
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      lines.push({ cells: [cellIdx(0,r,c), cellIdx(1,r,c), cellIdx(2,r,c)], type: 'Vertical pillar' });

  // Row-diagonals across layers: 3 rows × 2 directions = 6
  for (let r = 0; r < 3; r++) {
    lines.push({ cells: [cellIdx(0,r,0), cellIdx(1,r,1), cellIdx(2,r,2)], type: 'Layer diagonal' });
    lines.push({ cells: [cellIdx(0,r,2), cellIdx(1,r,1), cellIdx(2,r,0)], type: 'Layer diagonal' });
  }

  // Column-diagonals across layers: 3 cols × 2 directions = 6
  for (let c = 0; c < 3; c++) {
    lines.push({ cells: [cellIdx(0,0,c), cellIdx(1,1,c), cellIdx(2,2,c)], type: 'Layer diagonal' });
    lines.push({ cells: [cellIdx(0,2,c), cellIdx(1,1,c), cellIdx(2,0,c)], type: 'Layer diagonal' });
  }

  // Space diagonals (corner to corner through the centre): 4
  lines.push({ cells: [cellIdx(0,0,0), cellIdx(1,1,1), cellIdx(2,2,2)], type: 'Space diagonal' });
  lines.push({ cells: [cellIdx(0,0,2), cellIdx(1,1,1), cellIdx(2,2,0)], type: 'Space diagonal' });
  lines.push({ cells: [cellIdx(0,2,0), cellIdx(1,1,1), cellIdx(2,0,2)], type: 'Space diagonal' });
  lines.push({ cells: [cellIdx(0,2,2), cellIdx(1,1,1), cellIdx(2,0,0)], type: 'Space diagonal' });

  return lines;
}

const WINNING_LINES = generateWinningLines(); // 49 lines total

function checkWinner(squares) {
  for (const { cells, type } of WINNING_LINES) {
    const [a, b, c] = cells;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], cells, type };
    }
  }
  return null;
}

const LAYER_LABELS = ['Layer 1  ·  Bottom', 'Layer 2  ·  Middle', 'Layer 3  ·  Top'];
const LAYER_DEPTH = [0.55, 0.75, 1.0];

function Cell({ value, isWinning, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  const active = hovered && !disabled && !value;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 68,
        height: 68,
        fontSize: 28,
        fontWeight: 800,
        fontFamily: 'Cabin, Georgia, sans-serif',
        color: value === 'X' ? TERRACOTTA : SAND,
        background: isWinning
          ? 'rgba(64,192,192,0.22)'
          : active
          ? 'rgba(64,192,192,0.09)'
          : 'rgba(255,255,255,0.04)',
        border: `2px solid ${
          isWinning ? TEAL : active ? 'rgba(64,192,192,0.45)' : 'rgba(216,198,157,0.18)'
        }`,
        borderRadius: 9,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.12s, border-color 0.12s, box-shadow 0.12s',
        outline: 'none',
        boxShadow: isWinning ? `0 0 16px rgba(64,192,192,0.35)` : 'none',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value}
    </button>
  );
}

function Layer({ layerIndex, squares, winningCells, onCellClick, gameOver }) {
  const depth = LAYER_DEPTH[layerIndex];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        fontSize: 11,
        fontFamily: 'Cabin, sans-serif',
        color: SAND,
        opacity: 0.55,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {LAYER_LABELS[layerIndex]}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 68px)',
        gap: 5,
        padding: 10,
        background: `rgba(25,41,87,${0.15 + layerIndex * 0.12})`,
        borderRadius: 13,
        border: `1px solid rgba(216,198,157,${0.06 + layerIndex * 0.06})`,
        opacity: depth,
      }}>
        {Array.from({ length: 9 }, (_, i) => {
          const r = Math.floor(i / 3);
          const c = i % 3;
          const ci = cellIdx(layerIndex, r, c);
          return (
            <Cell
              key={ci}
              value={squares[ci]}
              isWinning={winningCells.has(ci)}
              onClick={() => onCellClick(ci)}
              disabled={!!squares[ci] || gameOver}
            />
          );
        })}
      </div>
    </div>
  );
}

function HoverButton({ onClick, children, color = TEAL }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 32px',
        background: hovered ? color : 'transparent',
        border: `2px solid ${color}`,
        color: hovered ? NAVY : color,
        borderRadius: 24,
        fontSize: 14,
        fontFamily: 'Cabin, Georgia, sans-serif',
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.05em',
        transition: 'all 0.18s',
      }}
    >
      {children}
    </button>
  );
}

export default function TicTacToe3D() {
  const [squares, setSquares] = useState(Array(27).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const result = checkWinner(squares);
  const winner = result?.winner;
  const winningCells = new Set(result?.cells || []);
  const isDraw = !winner && squares.every(Boolean);
  const gameOver = !!(winner || isDraw);
  const currentPlayer = xIsNext ? 'X' : 'O';

  function handleClick(index) {
    if (squares[index] || gameOver) return;
    const next = [...squares];
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    const newResult = checkWinner(next);
    if (newResult) {
      setScores(s => ({ ...s, [newResult.winner]: s[newResult.winner] + 1 }));
    }
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(27).fill(null));
    setXIsNext(true);
  }

  function resetAll() {
    setSquares(Array(27).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0 });
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(155deg, #0c1630 0%, ${NAVY} 55%, #0a1420 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'Cabin, Georgia, sans-serif',
    }}>

      {/* Title */}
      <h1 style={{ color: SAND, fontSize: 32, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.02em' }}>
        3D Tic Tac Toe
      </h1>
      <div style={{ color: TEAL, fontSize: 13, marginBottom: 28, opacity: 0.8 }}>
        3 × 3 × 3 cube  ·  49 winning lines
      </div>

      {/* Scoreboard */}
      <div style={{
        display: 'flex',
        marginBottom: 22,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 40,
        border: '1px solid rgba(216,198,157,0.14)',
        overflow: 'hidden',
      }}>
        {[['X', TERRACOTTA], ['O', SAND]].map(([player, color], i) => (
          <div key={player} style={{
            padding: '10px 30px',
            textAlign: 'center',
            borderRight: i === 0 ? '1px solid rgba(216,198,157,0.14)' : 'none',
            background: !gameOver && currentPlayer === player ? 'rgba(255,255,255,0.06)' : 'transparent',
            transition: 'background 0.2s',
          }}>
            <div style={{ color, fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{scores[player]}</div>
            <div style={{ color: SAND, fontSize: 11, opacity: 0.55, marginTop: 3 }}>Player {player}</div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={{
        minHeight: 52,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
      }}>
        {winner ? (
          <>
            <div style={{ color: TEAL, fontSize: 20, fontWeight: 700 }}>
              Player {winner} wins!
            </div>
            <div style={{ color: SAND, fontSize: 12, opacity: 0.6, marginTop: 4 }}>
              via {result.type}
            </div>
          </>
        ) : isDraw ? (
          <div style={{ color: SAND, fontSize: 20, fontWeight: 600 }}>It's a draw!</div>
        ) : (
          <div style={{ color: currentPlayer === 'X' ? TERRACOTTA : SAND, fontSize: 19, fontWeight: 600 }}>
            Player {currentPlayer}'s turn
          </div>
        )}
      </div>

      {/* Boards */}
      <div style={{
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[0, 1, 2].map(l => (
          <React.Fragment key={l}>
            <Layer
              layerIndex={l}
              squares={squares}
              winningCells={winningCells}
              onCellClick={handleClick}
              gameOver={gameOver}
            />
            {l < 2 && (
              <div style={{ color: 'rgba(216,198,157,0.2)', fontSize: 18, userSelect: 'none' }}>▶</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: 28,
        maxWidth: 500,
        textAlign: 'center',
        color: SAND,
        fontSize: 12,
        lineHeight: 1.75,
        opacity: 0.45,
      }}>
        Win by getting 3 in a row within a layer · straight through all 3 layers ·
        diagonally across layers · or via a space diagonal through the cube's centre
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
        <HoverButton onClick={resetGame}>New Game</HoverButton>
        <HoverButton onClick={resetAll} color="rgba(216,198,157,0.5)">Reset Scores</HoverButton>
      </div>
    </div>
  );
}
