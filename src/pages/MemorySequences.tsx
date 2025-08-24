import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, RotateCcw, Home, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GameState = 'waiting' | 'showing' | 'input' | 'result' | 'gameOver';

const MemorySequences = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const sequenceLength = Math.min(3 + currentLevel, 12);
  const showTime = Math.max(800 - (currentLevel * 30), 400); // Cards show progressively faster

  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: sequenceLength }, () => 
      Math.floor(Math.random() * 10)
    );
    setSequence(newSequence);
  }, [sequenceLength]);

  const startGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setStreak(0);
    setUserInput('');
    generateSequence();
    setGameState('showing');
    setShowingIndex(0);
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setUserInput('');
    generateSequence();
    setGameState('showing');
    setShowingIndex(0);
  };

  const resetGame = () => {
    setGameState('waiting');
    setCurrentLevel(1);
    setScore(0);
    setStreak(0);
    setUserInput('');
    setTimeLeft(0);
  };

  // Handle sequence showing animation
  useEffect(() => {
    if (gameState === 'showing') {
      if (showingIndex < sequence.length) {
        const timer = setTimeout(() => {
          setShowingIndex(prev => prev + 1);
        }, showTime);
        return () => clearTimeout(timer);
      } else {
        // Start input phase
        setTimeout(() => {
          setGameState('input');
          setTimeLeft(30); // 30 seconds to input
        }, 500);
      }
    }
  }, [gameState, showingIndex, sequence.length, showTime]);

  // Handle input countdown
  useEffect(() => {
    if (gameState === 'input' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'input' && timeLeft === 0) {
      checkAnswer();
    }
  }, [gameState, timeLeft]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState !== 'input') return;
      
      if (event.key >= '0' && event.key <= '9') {
        handleNumberInput(event.key);
      } else if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, userInput, sequence.length]);

  const checkAnswer = () => {
    const correct = userInput === sequence.join('');
    
    if (correct) {
      const levelScore = currentLevel * 10 + (timeLeft * 2) + (streak * 5);
      setScore(prev => prev + levelScore);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      setGameState('result');
      
      setTimeout(() => {
        if (currentLevel >= 10) {
          setGameState('gameOver');
        } else {
          nextLevel();
        }
      }, 2000);
    } else {
      setStreak(0);
      setGameState('gameOver');
    }
  };

  const handleNumberInput = (digit: string) => {
    if (userInput.length < sequence.length) {
      setUserInput(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (userInput.length === sequence.length) {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/games')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Games
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              Level {currentLevel}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Score: {score}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Streak: {streak}
            </Badge>
          </div>
        </div>

        {/* Game Content */}
        <Card className="border-[hsl(180,83%,57%)]/20">
          <CardContent className="p-8">
            {gameState === 'waiting' && (
              <div className="text-center">
                <Brain className="w-16 h-16 text-[hsl(180,83%,57%)] mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-foreground mb-4">Memory Sequences</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Watch the sequence of numbers appear, then reproduce them exactly. 
                  Each level gets longer and faster!
                </p>
                <Button 
                  onClick={startGame}
                  className="bg-[hsl(180,83%,57%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(180,83%,57%)]/90 px-8 py-3 text-lg"
                >
                  Start Game
                </Button>
              </div>
            )}

            {gameState === 'showing' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Level {currentLevel} - Memorize the sequence
                </h2>
                <Progress 
                  value={(showingIndex / sequence.length) * 100} 
                  className="mb-8 max-w-md mx-auto"
                />
                
                <div className="flex justify-center items-center">
                  <div className="grid grid-cols-6 gap-4 max-w-2xl">
                    {sequence.map((digit, index) => (
                      <div
                        key={index}
                        className={`aspect-square w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                          index < showingIndex
                            ? 'bg-[hsl(180,83%,57%)]/20 border-[hsl(180,83%,57%)] text-[hsl(180,83%,57%)] scale-105'
                            : index === showingIndex
                            ? 'bg-[hsl(180,83%,57%)] border-[hsl(180,83%,57%)] text-[hsl(220,13%,8%)] scale-110 shadow-lg'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {index <= showingIndex ? digit : '?'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'input' && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Enter the sequence
                </h2>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="text-lg text-muted-foreground">Time left:</div>
                  <Badge variant={timeLeft <= 10 ? "destructive" : "secondary"} className="text-lg px-3 py-1">
                    {timeLeft}s
                  </Badge>
                </div>
                
                {/* Input Display */}
                <div className="flex justify-center items-center gap-4 mb-8">
                  <div className="grid grid-cols-6 gap-3 max-w-2xl">
                    {Array.from({ length: sequence.length }).map((_, index) => (
                      <div
                        key={index}
                        className={`aspect-square w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold ${
                          index < userInput.length
                            ? 'bg-[hsl(180,83%,57%)]/20 border-[hsl(180,83%,57%)] text-[hsl(180,83%,57%)]'
                            : index === userInput.length
                            ? 'bg-muted border-[hsl(180,83%,57%)] text-muted-foreground animate-pulse'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}
                      >
                        {userInput[index] || ''}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">
                  Use your keyboard to enter the numbers (0-9)
                </p>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleBackspace}
                    variant="outline"
                    className="px-8"
                    disabled={userInput.length === 0}
                  >
                    Backspace
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-[hsl(180,83%,57%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(180,83%,57%)]/90 px-8"
                    disabled={userInput.length !== sequence.length}
                  >
                    Submit (Enter)
                  </Button>
                </div>
              </div>
            )}

            {gameState === 'result' && (
              <div className="text-center">
                <Trophy className="w-16 h-16 text-[hsl(180,83%,57%)] mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-[hsl(180,83%,57%)] mb-4">Correct!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Moving to Level {currentLevel + 1}...
                </p>
                <div className="space-y-2">
                  <div>Level Score: +{currentLevel * 10 + (timeLeft * 2) + ((streak - 1) * 5)}</div>
                  <div>Streak Bonus: +{(streak - 1) * 5}</div>
                </div>
              </div>
            )}

            {gameState === 'gameOver' && (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-6">Game Over</h2>
                <div className="space-y-4 mb-8">
                  <div className="text-2xl font-bold text-[hsl(180,83%,57%)]">
                    Final Score: {score}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Best Streak: {bestStreak}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    Reached Level: {currentLevel}
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={resetGame}
                    className="bg-[hsl(180,83%,57%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(180,83%,57%)]/90 px-8"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/games')}
                  >
                    Back to Games
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemorySequences;