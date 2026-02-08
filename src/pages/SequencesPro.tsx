import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Clock, Star, RotateCcw, Undo2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import CountdownTimer from "@/components/CountdownTimer";
import { createSequenceQuestion, type Difficulty } from "@/lib/sequencesProLogic";

const SequencesPro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(() => {
    const params = new URLSearchParams(location.search);
    const d = parseInt(params.get('duration') || '180', 10);
    return isNaN(d) ? 180 : d;
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const params = new URLSearchParams(location.search);
    const d = (params.get('difficulty') || 'medium').toLowerCase();
    return (d === 'easy' || d === 'medium' || d === 'hard') ? d : 'medium';
  });
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<{ sequence: number[]; answer: number }>({ sequence: [], answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Purple theme colors
  const themeColors = {
    primary: "hsl(270, 95%, 60%)",
    primaryRgb: "147, 51, 234",
    primaryForeground: "hsl(220, 13%, 8%)"
  };

  const generateSequence = useCallback(() => {
    const { question, answer } = createSequenceQuestion(difficulty, 5);
    setCurrentSequence({ sequence: question, answer });
  }, [difficulty]);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 1) {
      const timer = setTimeout(() => {
        setGameState('playing');
        generateSequence();
      }, 1000);
      return () => clearTimeout(timer);
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
      <CountdownTimer
        countdown={countdown}
        color={themeColors.primary}
        title="Sequences Pro"
        subtitle="Find the pattern and complete the sequence!"
      />
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
              variant="clean"
              className="w-full h-10 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
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

  return (
    <div className="min-h-screen bg-background flex justify-center pt-4 px-4">
      <div className="w-full max-w-4xl bg-card rounded-lg border border-border flex flex-col">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5" />
            <span className="font-medium">{score} points</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate('/games')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Undo2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-border/50" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
          <div className="text-lg text-muted-foreground mb-6">What comes next?</div>
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <span className="text-4xl md:text-6xl font-light text-foreground tracking-wide font-mono">
              {currentSequence.sequence.join(', ')},
            </span>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-24 md:w-32 h-14 md:h-16 text-2xl md:text-3xl text-center bg-transparent rounded-md [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none"
              style={{ border: `2px solid ${themeColors.primary}` }}
              autoFocus
            />
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50" />
        <div className="px-4 py-4 text-center">
          <span className="text-muted-foreground text-sm">Sequences Pro</span>
        </div>
      </div>
    </div>
  );
};

export default SequencesPro;