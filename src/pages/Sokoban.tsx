import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, Home, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Cell = 'wall' | 'floor' | 'target' | 'box' | 'boxOnTarget' | 'player' | 'playerOnTarget';

interface Level {
  id: number;
  name: string;
  difficulty: string;
  grid: Cell[][];
  playerStart: { x: number; y: number };
}

const levels: Level[] = [
  {
    id: 1,
    name: "First Steps",
    difficulty: "Easy",
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'player', 'box', 'target', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall']
    ],
    playerStart: { x: 1, y: 1 }
  },
  {
    id: 2,
    name: "Corner Push",
    difficulty: "Easy",
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'target', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'player', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall']
    ],
    playerStart: { x: 3, y: 3 }
  },
  {
    id: 3,
    name: "Two Boxes",
    difficulty: "Medium",
    grid: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'target', 'target', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'box', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'player', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
    ],
    playerStart: { x: 3, y: 3 }
  }
];

const Sokoban = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const initializeLevel = useCallback((levelIndex: number) => {
    const level = levels[levelIndex];
    setGrid(JSON.parse(JSON.stringify(level.grid)));
    setPlayerPos(level.playerStart);
    setMoves(0);
    setIsCompleted(false);
  }, []);

  useEffect(() => {
    initializeLevel(currentLevel);
  }, [currentLevel, initializeLevel]);

  const getCellDisplay = (cell: Cell) => {
    switch (cell) {
      case 'wall': return '🟫';
      case 'floor': return '⬜';
      case 'target': return '🎯';
      case 'box': return '📦';
      case 'boxOnTarget': return '✅';
      case 'player': return '🧑';
      case 'playerOnTarget': return '🧑';
      default: return '⬜';
    }
  };

  const getCellStyle = (cell: Cell) => {
    const baseStyle = "w-8 h-8 flex items-center justify-center text-lg select-none";
    switch (cell) {
      case 'target':
      case 'playerOnTarget':
        return `${baseStyle} bg-yellow-500/20`;
      case 'boxOnTarget':
        return `${baseStyle} bg-green-500/20`;
      default:
        return baseStyle;
    }
  };

  const checkWin = (newGrid: Cell[][]) => {
    for (let y = 0; y < newGrid.length; y++) {
      for (let x = 0; x < newGrid[y].length; x++) {
        if (newGrid[y][x] === 'box') return false;
      }
    }
    return true;
  };

  const movePlayer = (dx: number, dy: number) => {
    if (isCompleted) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newY < 0 || newY >= grid.length || newX < 0 || newX >= grid[0].length) return;

    const targetCell = grid[newY][newX];

    if (targetCell === 'wall') return;

    const newGrid = [...grid];
    
    // Remove player from current position
    if (grid[playerPos.y][playerPos.x] === 'playerOnTarget') {
      newGrid[playerPos.y][playerPos.x] = 'target';
    } else {
      newGrid[playerPos.y][playerPos.x] = 'floor';
    }

    if (targetCell === 'box' || targetCell === 'boxOnTarget') {
      // Try to push box
      const boxNewX = newX + dx;
      const boxNewY = newY + dy;

      if (boxNewY < 0 || boxNewY >= grid.length || boxNewX < 0 || boxNewX >= grid[0].length) return;

      const boxTargetCell = grid[boxNewY][boxNewX];

      if (boxTargetCell === 'wall' || boxTargetCell === 'box' || boxTargetCell === 'boxOnTarget') return;

      // Move box
      if (boxTargetCell === 'target') {
        newGrid[boxNewY][boxNewX] = 'boxOnTarget';
      } else {
        newGrid[boxNewY][boxNewX] = 'box';
      }

      // Remove box from current position and place player
      if (targetCell === 'boxOnTarget') {
        newGrid[newY][newX] = 'playerOnTarget';
      } else {
        newGrid[newY][newX] = 'player';
      }
    } else {
      // Move player to empty space
      if (targetCell === 'target') {
        newGrid[newY][newX] = 'playerOnTarget';
      } else {
        newGrid[newY][newX] = 'player';
      }
    }

    setGrid(newGrid);
    setPlayerPos({ x: newX, y: newY });
    setMoves(moves + 1);

    if (checkWin(newGrid)) {
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          initializeLevel(currentLevel);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, moves, isCompleted, currentLevel, initializeLevel]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Hard": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/games")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className={getDifficultyColor(levels[currentLevel].difficulty)} variant="outline">
              {levels[currentLevel].difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Level {currentLevel + 1} of {levels.length}
            </span>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sokoban Puzzle</h1>
          <h2 className="text-xl text-muted-foreground mb-4">{levels[currentLevel].name}</h2>
          <p className="text-sm text-muted-foreground">
            Push all boxes 📦 to targets 🎯 • Use WASD or Arrow keys to move
          </p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Moves: {moves}</span>
          </div>
        </div>

        {/* Game Grid */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border border-border rounded-xl p-6 inline-block">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)` }}>
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={getCellStyle(cell)}
                  >
                    {getCellDisplay(cell)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => initializeLevel(currentLevel)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset (R)
          </Button>
        </div>

        {/* Win Message */}
        {isCompleted && (
          <div className="text-center bg-card border border-border rounded-xl p-8 mb-8">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Level Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Completed in {moves} moves
            </p>
            <div className="flex justify-center gap-4">
              {currentLevel < levels.length - 1 ? (
                <Button onClick={nextLevel} className="bg-[hsl(45,93%,58%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(45,93%,58%)]/90">
                  Next Level
                </Button>
              ) : (
                <Button onClick={() => navigate("/games")} className="bg-[hsl(45,93%,58%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(45,93%,58%)]/90">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              )}
              <Button onClick={() => initializeLevel(currentLevel)} variant="outline">
                Play Again
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧑</span>
              <span>Player</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <span>Box</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span>Target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>Box on Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sokoban;