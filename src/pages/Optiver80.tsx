import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Clock, Star, RotateCcw, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";
import CountdownTimer from "@/components/CountdownTimer";

const Optiver80 = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(80); // 80 seconds
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ a: 0, b: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Red theme colors
  const themeColors = {
    primary: "hsl(0, 84%, 60%)",
    primaryRgb: "239, 68, 68",
    primaryForeground: "hsl(220, 13%, 8%)"
  };

  const generateQuestion = useCallback(() => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 80) + 20;
        b = Math.floor(Math.random() * 40) + 5;
        answer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 15) + 2;
        b = Math.floor(Math.random() * 15) + 2;
        answer = a * b;
        break;
      default:
        a = b = answer = 0;
    }

    setCurrentQuestion({ a, b, operation, answer });
  }, []);

  useEffect(() => {
    if (gameState === 'countdown' && countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 1) {
      const timer = setTimeout(() => {
        setGameState('playing');
        generateQuestion();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, countdown, generateQuestion]);

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
    if (answer === currentQuestion.answer) {
      setScore(score + 1);
    }
    setQuestionsAnswered(questionsAnswered + 1);
    setUserAnswer('');
    generateQuestion();
  };

  const getPerformanceRating = () => {
    if (score >= 70) return { text: "Outstanding!", color: themeColors.primary };
    if (score >= 60) return { text: "Excellent", color: "hsl(122, 39%, 49%)" };
    if (score >= 50) return { text: "Good", color: "hsl(48, 96%, 53%)" };
    if (score >= 40) return { text: "Fair", color: "hsl(25, 95%, 53%)" };
    return { text: "Keep Practicing", color: "hsl(0, 84%, 60%)" };
  };

  if (gameState === 'countdown') {
    return (
      <CountdownTimer
        countdown={countdown}
        color={themeColors.primary}
        title="Optiver 80 in 80"
        subtitle="80 questions in 80 seconds - Can you make it?"
      />
    );
  }

  if (gameState === 'finished') {
    const rating = getPerformanceRating();
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Trophy 
            className="w-16 h-16 mx-auto mb-6" 
            style={{ color: themeColors.primary }}
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">Challenge Complete!</h1>
          <div className="bg-card rounded-xl p-6 mb-6 border">
            <div 
              className="text-3xl font-bold mb-2"
              style={{ color: themeColors.primary }}
            >
              {score}/80
            </div>
            <div className="text-muted-foreground">Correct Answers</div>
            <div 
              className="text-lg font-bold mt-2"
              style={{ color: rating.color }}
            >
              {rating.text}
            </div>
          </div>
          {score >= 60 && (
            <div 
              className="border rounded-lg p-4 mb-6"
              style={{
                backgroundColor: `rgba(${themeColors.primaryRgb}, 0.1)`,
                borderColor: `rgba(${themeColors.primaryRgb}, 0.3)`
              }}
            >
              <p 
                className="text-sm"
                style={{ color: themeColors.primary }}
              >
                🎉 Congratulations! You've reached Optiver interview level!
              </p>
            </div>
          )}
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
              Try Again
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
            <span className={`font-medium ${timeLeft <= 10 ? 'text-destructive animate-pulse' : ''}`}>
              {timeLeft} seconds
            </span>
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
        <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-8">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <span className="text-5xl md:text-7xl font-light text-foreground tracking-wide">
              {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b} =
            </span>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-24 md:w-32 h-16 md:h-20 text-3xl md:text-4xl text-center bg-transparent rounded-md [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none"
              style={{ border: `2px solid ${themeColors.primary}` }}
              autoFocus
            />
          </form>
        </div>
        
        {/* Footer */}
        <div className="border-t border-border/50" />
        <div className="px-4 py-4 text-center">
          <span className="text-muted-foreground text-sm">Optiver 80 in 80</span>
        </div>
      </div>
    </div>
  );
};

export default Optiver80;