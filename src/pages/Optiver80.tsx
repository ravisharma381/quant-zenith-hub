import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Optiver80 = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(80); // 80 seconds
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ a: 0, b: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

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
    if (score >= 70) return { text: "Outstanding!", color: "text-primary" };
    if (score >= 60) return { text: "Excellent", color: "text-green-400" };
    if (score >= 50) return { text: "Good", color: "text-yellow-400" };
    if (score >= 40) return { text: "Fair", color: "text-orange-400" };
    return { text: "Keep Practicing", color: "text-red-400" };
  };

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Optiver 80 in 80</h1>
          </div>
          <div className="text-8xl font-bold text-primary mb-4 animate-pulse">
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
          <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">Challenge Complete!</h1>
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="text-3xl font-bold text-primary mb-2">{score}/80</div>
            <div className="text-muted-foreground">Correct Answers</div>
            <div className={`text-lg font-bold mt-2 ${rating.color}`}>
              {rating.text}
            </div>
          </div>
          {score >= 60 && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <p className="text-primary text-sm">
                🎉 Congratulations! You've reached Optiver interview level!
              </p>
            </div>
          )}
          <div className="space-y-4">
            <Button onClick={() => window.location.reload()} className="w-full">
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
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/games')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">Optiver 80 in 80</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="text-lg font-bold text-primary">{score}/80</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(80 - timeLeft) / 80 * 100} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Target: 60+ correct</span>
            <span>Questions: {questionsAnswered}</span>
          </div>
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
              placeholder="Answer"
              autoFocus
            />
            <Button type="submit" size="lg" className="w-full" disabled={!userAnswer}>
              Submit
            </Button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 flex justify-center space-x-8 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{Math.round((questionsAnswered / (80 - timeLeft || 1)) * 60) || 0}</div>
            <div className="text-sm text-muted-foreground">Questions/min</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {questionsAnswered > 0 ? Math.round((score / questionsAnswered) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Optiver80;