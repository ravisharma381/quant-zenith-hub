import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArithmeticPro = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ a: 0, b: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = useCallback(() => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * 100) + 1;
        b = Math.floor(Math.random() * 100) + 1;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * 100) + 50;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 20) + 1;
        answer = a * b;
        break;
      case '÷':
        answer = Math.floor(Math.random() * 20) + 1;
        b = Math.floor(Math.random() * 12) + 2;
        a = answer * b;
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Arithmetic Pro</h1>
          <div className="text-8xl font-bold text-primary mb-4 animate-pulse">
            {countdown || "GO!"}
          </div>
          <p className="text-muted-foreground">Get ready for rapid-fire mental math!</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Game Over!</h1>
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="text-3xl font-bold text-primary mb-2">{score}</div>
            <div className="text-muted-foreground">Correct Answers</div>
            <div className="text-sm text-muted-foreground mt-2">
              out of {questionsAnswered} questions
            </div>
          </div>
          <div className="space-y-4">
            <Button onClick={() => window.location.reload()} className="w-full">
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
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/games')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-lg font-bold text-primary">Score: {score}</div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(180 - timeLeft) / 180 * 100} className="h-2" />
        </div>

        {/* Question */}
        <div className="bg-card rounded-xl p-12 text-center">
          <div className="text-6xl font-bold text-foreground mb-8">
            {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b} = ?
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-2xl h-16"
              placeholder="Your answer"
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full" disabled={!userAnswer}>
              Submit Answer
            </Button>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-8 text-center">
          <div className="text-muted-foreground">
            Questions answered: {questionsAnswered} | Accuracy: {questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArithmeticPro;