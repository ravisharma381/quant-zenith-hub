import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-8">
          <div className="justify-self-start">
            <Button variant="ghost" onClick={() => navigate('/games')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div 
            className="justify-self-center text-2xl font-bold text-center"
            style={{ color: themeColors.primary }}
          >
            {score}/80
          </div>
          <div className="justify-self-end flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span 
              className={`${timeLeft <= 10 ? 'animate-pulse' : ''} font-mono text-lg`}
              style={{ color: timeLeft <= 10 ? themeColors.primary : 'inherit' }}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div 
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: `rgba(${themeColors.primaryRgb}, 0.2)` }}
          >
            <div 
              className="h-2 rounded-full transition-[width] duration-1000 ease-linear"
              style={{ 
                width: `${(80 - timeLeft) / 80 * 100}%`,
                backgroundColor: themeColors.primary
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Target: 60+ correct</span>
            <span>Questions: {questionsAnswered}</span>
          </div>
        </div>

        {/* Question */}
        <div 
          className="bg-card rounded-xl p-12 text-center border-2 transition-all duration-300"
          style={{
            borderColor: `rgba(${themeColors.primaryRgb}, 0.2)`,
            boxShadow: `0 0 30px rgba(${themeColors.primaryRgb}, 0.1)`
          }}
        >
          <div className="text-4xl font-bold text-foreground mb-8">
            {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b} = ?
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-xl h-12 max-w-xs mx-auto [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{
                borderColor: `rgba(${themeColors.primaryRgb}, 0.3)`,
                boxShadow: userAnswer ? `0 0 10px rgba(${themeColors.primaryRgb}, 0.2)` : 'none'
              }}
              placeholder="Answer"
              autoFocus
            />
            {(() => { const theme = getGameTheme(3); return (
              <Button 
                type="submit" 
                className={`mx-auto px-8 ${theme.buttonStyles}`}
                disabled={!userAnswer}
              >
                Submit
              </Button>
            )})()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Optiver80;