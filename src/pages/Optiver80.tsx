import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";

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
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing');
      generateQuestion();
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
      <div className="min-h-screen bg-background flex items-center justify-center -mt-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap 
              className="w-12 h-12 mr-4" 
              style={{ color: themeColors.primary }}
            />
            <h1 className="text-4xl font-bold text-foreground">Optiver 80 in 80</h1>
          </div>
          <div 
            className="text-8xl font-bold mb-4 animate-pulse"
            style={{ color: themeColors.primary }}
          >
            {countdown || "GO!"}
          </div>
          <p className="text-muted-foreground">80 questions in 80 seconds - Can you make it?</p>
        </div>
      </div>
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
              className="w-full"
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      {/* Timer - Top Right */}
      <div 
        className={`absolute top-6 right-6 px-4 py-2 rounded-lg border-2 font-mono text-xl font-bold ${timeLeft <= 10 ? 'animate-pulse' : ''}`}
        style={{
          borderColor: themeColors.primary,
          color: themeColors.primary
        }}
      >
        {timeLeft}s
      </div>

      {/* Question - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="text-6xl md:text-8xl font-bold mb-8"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b} = ?
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
              placeholder="Your answer"
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
              Submit
            </Button>
          </form>
        </div>
      </div>

      {/* Score - Bottom Center */}
      <div 
        className="absolute bottom-8 text-2xl font-bold"
        style={{ color: 'hsl(var(--foreground))' }}
      >
        Score: {score}/80
      </div>
    </div>
  );
};

export default Optiver80;