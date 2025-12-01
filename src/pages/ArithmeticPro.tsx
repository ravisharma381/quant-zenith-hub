import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, Zap, Timer, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGameTheme } from "@/lib/gameTheme";
import CountdownTimer from "@/components/CountdownTimer";

const ArithmeticPro = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'setup' | 'countdown' | 'playing' | 'finished'>('setup');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ a: 0, b: 0, operation: '+', answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Game setup state
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [selectedDuration, setSelectedDuration] = useState<60 | 120 | 180>(180);
  const [selectedOps, setSelectedOps] = useState<Array<'+' | '-' | '×' | '÷'>>(['+', '-', '×', '÷']);

  // Green theme colors
  const themeColors = {
    primary: "hsl(122, 97%, 50%)",
    primaryRgb: "34, 197, 94",
    primaryForeground: "hsl(220, 13%, 8%)"
  };

  const generateQuestion = useCallback(() => {
    const operations = selectedOps.length ? selectedOps : ['+'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let a = 0, b = 0, answer = 0;

    const ranges = (() => {
      switch (selectedDifficulty) {
        case 'Easy':
          return { addSubMax: 60, mulMaxA: 12, mulMaxB: 12 };
        case 'Hard':
          return { addSubMax: 200, mulMaxA: 20, mulMaxB: 20 };
        default:
          return { addSubMax: 100, mulMaxA: 15, mulMaxB: 15 };
      }
    })();

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * ranges.addSubMax) + 1;
        b = Math.floor(Math.random() * ranges.addSubMax) + 1;
        answer = a + b;
        break;
      case '-':
        a = Math.floor(Math.random() * ranges.addSubMax) + Math.floor(ranges.addSubMax / 2);
        b = Math.floor(Math.random() * Math.floor(ranges.addSubMax / 2)) + 1;
        answer = a - b;
        break;
      case '×':
        a = Math.floor(Math.random() * ranges.mulMaxA) + 1;
        b = Math.floor(Math.random() * ranges.mulMaxB) + 1;
        answer = a * b;
        break;
      case '÷':
        answer = Math.floor(Math.random() * ranges.mulMaxA) + 1;
        b = Math.floor(Math.random() * Math.max(2, ranges.mulMaxB)) + 1;
        a = answer * b;
        break;
      default:
        a = b = answer = 0;
    }

    setCurrentQuestion({ a, b, operation, answer });
  }, [selectedDifficulty, selectedOps]);

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

  const handleStart = () => {
    setTimeLeft(selectedDuration);
    setCountdown(3);
    setGameState('countdown');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'setup') {
    const theme = getGameTheme(1);
    const isOpSelected = (op: '+' | '-' | '×' | '÷') => selectedOps.includes(op);
    return (
      <div className="min-h-screen bg-background flex justify-center pt-4 pb-4 px-4">
        <div className="w-full max-w-lg bg-card rounded-2xl p-4 md:p-8 border" style={{ borderColor: 'hsl(var(--primary))' }}>
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-2 text-center">Quant Arithmetic Zetamac</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 text-center">Configure your drill, then race the clock with rapid-fire arithmetic.</p>

          <section className="mb-4 md:mb-6">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Choose Difficulty</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {(['Easy','Medium','Hard'] as const).map((d) => (
                <Button
                  key={d}
                  variant="outline"
                  onClick={() => setSelectedDifficulty(d)}
                  className="flex-1 text-xs md:text-sm px-2 md:px-4"
                  style={selectedDifficulty === d ? { backgroundColor: d === 'Easy' ? 'hsl(var(--primary) / 0.2)' : d === 'Medium' ? 'hsl(var(--warning) / 0.2)' : 'hsl(var(--destructive) / 0.2)', color: d === 'Easy' ? 'hsl(var(--primary))' : d === 'Medium' ? 'hsl(var(--warning))' : 'hsl(var(--destructive))', borderColor: d === 'Easy' ? 'hsl(var(--primary) / 0.3)' : d === 'Medium' ? 'hsl(var(--warning) / 0.3)' : 'hsl(var(--destructive) / 0.3)' } : {}}
                >
                  {d}
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-4 md:mb-6">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Choose Duration</h2>
            <div className="flex gap-2 md:gap-3 justify-center">
              {[60, 120, 180].map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => setSelectedDuration(s as 60 | 120 | 180)}
                  className="flex-1 text-xs md:text-sm px-1 md:px-4"
                  style={selectedDuration === s ? { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary) / 0.3)' } : {}}
                >
                  {s === 60 ? (<><Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Bullet - </span>1 min</>) : s === 120 ? (<><Timer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Blitz - </span>2 min</>) : (<><Rocket className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Rapid - </span>3 min</>)}
                </Button>
              ))}
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xs md:text-sm text-muted-foreground mb-2 text-center">Choose Operations (minimum 1)</h2>
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-3 md:justify-center">
              {(['+','-','×','÷'] as const).map((op) => {
                const active = isOpSelected(op);
                return (
                  <Button
                    key={op}
                    variant="outline"
                    onClick={() => {
                      setSelectedOps((prev) => {
                        const has = prev.includes(op as any);
                        if (has) {
                          if (prev.length === 1) return prev; // enforce at least 1
                          return prev.filter(o => o !== op);
                        }
                        return [...prev, op];
                      });
                    }}
                    className="text-xs md:text-sm"
                    style={active ? { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary) / 0.3)' } : {}}
                  >
                    {op === '+' ? 'addition' : op === '-' ? 'subtraction' : op === '×' ? 'multiplication' : 'division'}
                  </Button>
                );
              })}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/games')} className="text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
            </Button>
            <Button onClick={handleStart} className={`px-8 ${theme.buttonStyles} text-sm`}>
              Start Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <CountdownTimer
        countdown={countdown}
        color={themeColors.primary}
        title="Quant Arithmetic Zetamac"
        subtitle="Get ready for rapid-fire mental math!"
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

  return (
    <div className="min-h-screen bg-background p-2 md:p-4">
      <div className="container mx-auto max-w-xl md:max-w-2xl">
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-4 md:mb-8">
          <div className="justify-self-start">
            <div className="text-foreground font-bold text-sm md:text-base">{score} points</div>
          </div>
          <div className="justify-self-center text-lg md:text-2xl font-bold text-center">
            Quant Arithmetic Zetamac
          </div>
          <div className="justify-self-end flex items-center">
            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-muted-foreground" />
            <span className="font-mono text-sm md:text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 md:mb-8">
          <div 
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: `rgba(${themeColors.primaryRgb}, 0.2)` }}
          >
            <div 
              className="h-2 rounded-full transition-[width] duration-1000 ease-linear"
              style={{ 
                width: `${(selectedDuration - timeLeft) / selectedDuration * 100}%`,
                backgroundColor: themeColors.primary
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div 
          className="bg-card rounded-xl p-6 md:p-12 text-center border-2 transition-all duration-300"
          style={{
            borderColor: `rgba(${themeColors.primaryRgb}, 0.2)`,
            boxShadow: `0 0 30px rgba(${themeColors.primaryRgb}, 0.1)`
          }}
        >
          <div className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-8">
            {currentQuestion.a} {currentQuestion.operation} {currentQuestion.b} = ?
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="text-center text-lg md:text-xl h-10 md:h-12 max-w-xs mx-auto [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{
                borderColor: `rgba(${themeColors.primaryRgb}, 0.3)`,
                boxShadow: userAnswer ? `0 0 10px rgba(${themeColors.primaryRgb}, 0.2)` : 'none'
              }}
              placeholder="Your answer"
              autoFocus
            />
            {(() => { const theme = getGameTheme(1); return (
              <Button 
                type="submit" 
                className={`mx-auto px-6 md:px-8 ${theme.buttonStyles} text-sm md:text-base`}
                disabled={!userAnswer}
              >
                Submit Answer
              </Button>
            )})()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArithmeticPro;