import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";

const SequencesPro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(() => {
    const params = new URLSearchParams(location.search);
    const d = parseInt(params.get('duration') || '300', 10);
    return isNaN(d) ? 300 : d; // default 5 minutes
  });
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<{ sequence: number[], answer: number, type: string }>({ sequence: [], answer: 0, type: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Purple theme colors
  const themeColors = {
    primary: "hsl(270, 95%, 60%)",
    primaryRgb: "147, 51, 234",
    primaryForeground: "hsl(220, 13%, 8%)"
  };

  const generateSequence = useCallback(() => {
    const types = ['arithmetic', 'geometric', 'fibonacci', 'squares', 'cubes'];
    const type = types[Math.floor(Math.random() * types.length)];
    let sequence: number[] = [];
    let answer = 0;

    switch (type) {
      case 'arithmetic': {
        const diff = Math.floor(Math.random() * 10) + 1;
        const start = Math.floor(Math.random() * 20) + 1;
        sequence = [start, start + diff, start + 2*diff, start + 3*diff, start + 4*diff];
        answer = start + 5*diff;
        break;
      }
      case 'geometric': {
        const ratio = Math.floor(Math.random() * 3) + 2;
        const base = Math.floor(Math.random() * 5) + 1;
        sequence = [base, base*ratio, base*ratio*ratio, base*ratio*ratio*ratio];
        answer = base * Math.pow(ratio, 4);
        break;
      }
      case 'fibonacci':
        sequence = [1, 1, 2, 3, 5];
        answer = 8;
        break;
      case 'squares': {
        const n = Math.floor(Math.random() * 3) + 2;
        sequence = [n*n, (n+1)*(n+1), (n+2)*(n+2), (n+3)*(n+3)];
        answer = (n+4)*(n+4);
        break;
      }
      case 'cubes': {
        const m = Math.floor(Math.random() * 3) + 2;
        sequence = [m*m*m, (m+1)*(m+1)*(m+1), (m+2)*(m+2)*(m+2)];
        answer = (m+3)*(m+3)*(m+3);
        break;
      }
    }

    setCurrentSequence({ sequence, answer, type });
  }, []);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      generateSequence();
    }
  }, [gameState, countdown, generateSequence]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    if (answer === currentSequence.answer) {
      setScore(score + 1);
    }
    setQuestionsAnswered(questionsAnswered + 1);
    setUserAnswer('');
    generateSequence();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center -mt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Sequences Pro</h1>
          <div 
            className="text-8xl font-bold mb-4 animate-pulse"
            style={{ color: themeColors.primary }}
          >
            {countdown || "GO!"}
          </div>
          <p className="text-muted-foreground">Find the pattern and complete the sequence!</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Trophy 
            className="w-16 h-16 mx-auto mb-6" 
            style={{ color: themeColors.primary }}
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">Game Over!</h1>
          <div className="bg-card rounded-xl p-6 mb-6 border">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: themeColors.primary }}
            >
              {score}
            </div>
            <div className="text-muted-foreground">Correct Answers</div>
            <div className="text-sm text-muted-foreground mt-2">
              out of {questionsAnswered} questions
            </div>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
              style={{ 
                backgroundColor: themeColors.primary,
                color: themeColors.primaryForeground
              }}
            >
              Play Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalDuration = (() => {
    const d = parseInt(new URLSearchParams(location.search).get('duration') || `${timeLeft}`, 10);
    return isNaN(d) || d <= 0 ? timeLeft : d;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      {/* Timer - Top Right */}
      <div 
        className="absolute top-6 right-6 px-4 py-2 rounded-lg border-2 font-mono text-xl font-bold"
        style={{
          borderColor: themeColors.primary,
          color: themeColors.primary
        }}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Question - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="text-xl md:text-2xl font-bold mb-4"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            What comes next?
          </div>
          <div 
            className="text-4xl md:text-6xl font-bold mb-8 font-mono"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {currentSequence.sequence.join(', ')}, ?
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-2xl md:text-3xl h-16 max-w-md mx-auto border-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent"
              style={{
                borderColor: themeColors.primary,
                color: 'hsl(var(--foreground))'
              }}
              placeholder="Next number"
              autoFocus
            />
            <Button 
              type="submit" 
              className="px-8 py-6 text-lg"
              style={{
                backgroundColor: themeColors.primary,
                color: themeColors.primaryForeground
              }}
              disabled={!userAnswer}
            >
              Submit Answer
            </Button>
          </form>
        </div>
      </div>

      {/* Score - Bottom Center */}
      <div 
        className="absolute bottom-8 text-2xl font-bold"
        style={{ color: 'hsl(var(--foreground))' }}
      >
        Score: {score}
      </div>
    </div>
  );
};

export default SequencesPro;
